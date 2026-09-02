import { Agent, type ClientRequestArgs, createServer, type Server as HttpServer } from "node:http";
import { type AddressInfo, connect, type Socket } from "node:net";
import type { Duplex } from "node:stream";

import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { type WebSocket, WebSocketServer } from "ws";

import { DeepgramClient } from "../../../src";
import { mockServerPool } from "../../mock-server/MockServerPool";

type StreamingSocket = {
    connect(): unknown;
    waitForOpen(): Promise<void>;
    close(): void;
    on(event: "error", listener: (error: unknown) => void): unknown;
};

type UpgradeRequest = {
    url: string;
    authorization: string | undefined;
};

class ConnectProxyAgent extends Agent {
    public constructor(private readonly proxyPort: number) {
        super();
    }

    public override createConnection(
        options: ClientRequestArgs,
        callback: (error: Error | null, stream: Duplex) => void,
    ): undefined {
        const targetHost = String(options.hostname ?? options.host ?? "127.0.0.1");
        const targetPort = Number(options.port ?? 80);
        const socket = connect(this.proxyPort, "127.0.0.1");
        let response = Buffer.alloc(0);
        let settled = false;

        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            socket.destroy();
            callback(error, socket);
        };

        socket.setTimeout(2000, () => fail(new Error("Timed out waiting for proxy CONNECT response")));
        socket.once("error", fail);
        socket.once("connect", () => {
            socket.write(
                `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\n` +
                    `Host: ${targetHost}:${targetPort}\r\n` +
                    "Connection: keep-alive\r\n\r\n",
            );
        });
        socket.on("data", (chunk) => {
            if (settled) return;
            response = Buffer.concat([response, chunk]);
            const headerEnd = response.indexOf("\r\n\r\n");
            if (headerEnd === -1) return;

            const statusLine = response.subarray(0, headerEnd).toString("utf8").split("\r\n")[0];
            if (!statusLine?.includes(" 200 ")) {
                fail(new Error(`Proxy CONNECT failed: ${statusLine}`));
                return;
            }

            settled = true;
            socket.setTimeout(0);
            socket.removeAllListeners("data");
            socket.removeListener("error", fail);
            const remainder = response.subarray(headerEnd + 4);
            if (remainder.length > 0) socket.unshift(remainder);
            callback(null, socket);
        });

        return undefined;
    }
}

async function startConnectProxy(): Promise<{
    agent: ConnectProxyAgent;
    targets: string[];
    close(): Promise<void>;
}> {
    const targets: string[] = [];
    const sockets = new Set<Socket>();
    const server: HttpServer = createServer((_request, response) => {
        response.writeHead(405).end();
    });

    server.on("connection", (socket) => {
        sockets.add(socket);
        socket.once("close", () => sockets.delete(socket));
    });
    server.on("connect", (request, downstream, head) => {
        const authority = request.url ?? "";
        const target = new URL(`http://${authority}`);
        targets.push(authority);

        const upstream = connect(Number(target.port), target.hostname);
        sockets.add(upstream);
        upstream.once("close", () => sockets.delete(upstream));
        upstream.once("connect", () => {
            downstream.write("HTTP/1.1 200 Connection Established\r\n\r\n");
            if (head.length > 0) upstream.write(head);
            downstream.pipe(upstream);
            upstream.pipe(downstream);
        });
        upstream.once("error", () => {
            if (!downstream.destroyed) downstream.end("HTTP/1.1 502 Bad Gateway\r\n\r\n");
        });
    });

    await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => {
            server.removeListener("error", reject);
            resolve();
        });
    });

    const port = (server.address() as AddressInfo).port;
    const agent = new ConnectProxyAgent(port);

    return {
        agent,
        targets,
        async close() {
            agent.destroy();
            for (const socket of sockets) socket.destroy();
            if (!server.listening) return;
            await new Promise<void>((resolve, reject) => {
                server.close((error) => (error ? reject(error) : resolve()));
            });
        },
    };
}

describe("WebSocket proxy agent", () => {
    let server: WebSocketServer;
    let serverUrl: string;
    let targetAuthority: string;
    let upgradeRequests: UpgradeRequest[];
    let serverSockets: Set<WebSocket>;
    let clientSockets: StreamingSocket[];
    let proxies: Awaited<ReturnType<typeof startConnectProxy>>[];

    beforeAll(() => {
        // This test exercises real local sockets. MSW cannot passthrough an agent
        // whose createConnection callback waits for a CONNECT handshake.
        mockServerPool.close();
    });

    beforeEach(async () => {
        upgradeRequests = [];
        serverSockets = new Set();
        clientSockets = [];
        proxies = [];
        server = new WebSocketServer({ host: "127.0.0.1", port: 0 });
        server.on("connection", (socket, request) => {
            serverSockets.add(socket);
            socket.once("close", () => serverSockets.delete(socket));
            upgradeRequests.push({
                url: request.url ?? "",
                authorization: request.headers.authorization,
            });
        });

        await new Promise<void>((resolve, reject) => {
            server.once("error", reject);
            server.once("listening", () => {
                server.removeListener("error", reject);
                resolve();
            });
        });

        const port = (server.address() as AddressInfo).port;
        targetAuthority = `127.0.0.1:${port}`;
        serverUrl = `ws://${targetAuthority}`;
    });

    afterEach(async () => {
        for (const socket of clientSockets) {
            try {
                socket.close();
            } catch {
                // The target may already have closed during a failed assertion.
            }
        }
        for (const socket of serverSockets) socket.terminate();
        await Promise.all(proxies.map((proxy) => proxy.close()));
        await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    const createProxy = async () => {
        const proxy = await startConnectProxy();
        proxies.push(proxy);
        return proxy;
    };

    const createClient = (agent: Agent) =>
        new DeepgramClient({
            apiKey: "test-api-key",
            agent,
            environment: {
                base: "http://127.0.0.1",
                production: serverUrl,
                agent: serverUrl,
                agentRest: "http://127.0.0.1",
            },
        });

    const open = async (socket: StreamingSocket) => {
        clientSockets.push(socket);
        socket.on("error", () => {
            // Keep connection failures attached to waitForOpen instead of emitting unhandled errors.
        });
        socket.connect();
        await socket.waitForOpen();
    };

    it("routes every streaming service through a client-level CONNECT proxy", async () => {
        const proxy = await createProxy();
        const client = createClient(proxy.agent);
        const sockets: StreamingSocket[] = [
            await client.agent.v1.createConnection({ reconnectAttempts: 0 }),
            await client.listen.v1.createConnection({ model: "nova-3", reconnectAttempts: 0 }),
            await client.listen.v2.createConnection({ model: "flux-general-en", reconnectAttempts: 0 }),
            await client.speak.v1.createConnection({ model: "aura-2-thalia-en", reconnectAttempts: 0 }),
            await client.speak.v2.createConnection({ model: "flux-alexis-en", reconnectAttempts: 0 }),
        ];

        for (const socket of sockets) await open(socket);

        expect(proxy.targets).toEqual(Array(5).fill(targetAuthority));
        expect(upgradeRequests.map(({ url }) => new URL(url, serverUrl).pathname)).toEqual([
            "/v1/agent/converse",
            "/v1/listen",
            "/v2/listen",
            "/v1/speak",
            "/v2/speak",
        ]);
        for (const request of upgradeRequests) {
            expect(request.authorization).toBe("Token test-api-key");
            expect(new URL(request.url, serverUrl).searchParams.has("agent")).toBe(false);
        }
    });

    it("prefers a per-connection agent over the client-level default", async () => {
        const defaultProxy = await createProxy();
        const overrideProxy = await createProxy();
        const client = createClient(defaultProxy.agent);
        const socket = await client.listen.v1.createConnection({
            model: "nova-3",
            reconnectAttempts: 0,
            agent: overrideProxy.agent,
        });

        await open(socket);

        expect(defaultProxy.targets).toEqual([]);
        expect(overrideProxy.targets).toEqual([targetAuthority]);
        expect(upgradeRequests.map(({ url }) => new URL(url, serverUrl).searchParams.has("agent"))).toEqual([false]);
    });
});
