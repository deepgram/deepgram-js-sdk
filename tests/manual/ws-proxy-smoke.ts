/**
 * Manual smoke test for issue #493 — routing a streaming WebSocket connection
 * through an HTTP/HTTPS proxy via the new `agent` option.
 *
 * It stands up a local HTTP forward proxy (CONNECT tunnel) using only Node
 * built-ins, points an `https.Agent` at it, and opens a real Deepgram
 * `listen.v1` WebSocket through that agent. Success requires BOTH:
 *
 *   1. the WebSocket reaches the `open` state (the upgrade completed), and
 *   2. the local proxy logged a `CONNECT api.deepgram.com:443` — proving the
 *      traffic actually transited the proxy rather than going out directly.
 *
 * No third-party proxy-agent dependency is used so the test is self-contained.
 *
 * Requires DEEPGRAM_API_KEY in the environment or in a local .env file. Run with:
 *
 *     pnpm tsx tests/manual/ws-proxy-smoke.ts
 */

import { readFileSync } from "node:fs";
import * as http from "node:http";
import { Agent as HttpsAgent } from "node:https";
import * as net from "node:net";
import { join } from "node:path";
import * as tls from "node:tls";

import { DeepgramClient } from "../../src";

/** Load DEEPGRAM_API_KEY from the environment, falling back to a local .env. */
function loadApiKey(): string {
    if (process.env.DEEPGRAM_API_KEY) {
        return process.env.DEEPGRAM_API_KEY;
    }
    try {
        const envFile = readFileSync(join(process.cwd(), ".env"), "utf8");
        for (const line of envFile.split("\n")) {
            const match = line.match(/^\s*DEEPGRAM_API_KEY\s*=\s*(.+?)\s*$/);
            if (match) {
                return match[1];
            }
        }
    } catch {
        // no .env file
    }
    throw new Error("DEEPGRAM_API_KEY is not set (env or .env)");
}

/** A record of every CONNECT the local proxy tunnels. */
const connectLog: string[] = [];

/**
 * Start a local HTTP forward proxy that tunnels CONNECT requests to their
 * target host:port. Resolves with the listening port.
 */
function startProxy(): Promise<{ port: number; close: () => void }> {
    const server = http.createServer((_req, res) => {
        // Plain HTTP proxying is not needed for this test.
        res.writeHead(405);
        res.end("This proxy only supports CONNECT");
    });

    server.on("connect", (req, clientSocket, head) => {
        const [host, portStr] = (req.url ?? "").split(":");
        const port = Number(portStr) || 443;
        connectLog.push(`${host}:${port}`);

        const upstream = net.connect(port, host, () => {
            clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
            if (head && head.length) {
                upstream.write(head);
            }
            upstream.pipe(clientSocket);
            clientSocket.pipe(upstream);
        });

        const onError = (err: Error) => {
            connectLog.push(`ERROR ${host}:${port} ${err.message}`);
            clientSocket.destroy();
            upstream.destroy();
        };
        upstream.on("error", onError);
        clientSocket.on("error", () => upstream.destroy());
    });

    return new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () => {
            const address = server.address() as net.AddressInfo;
            resolve({ port: address.port, close: () => server.close() });
        });
    });
}

/**
 * Minimal HTTPS agent that tunnels through the local CONNECT proxy. This is the
 * same shape as `https-proxy-agent`, hand-rolled to keep the test dependency-free.
 * The `ws` library calls `agent.createConnection()` to obtain the TLS socket for
 * a `wss://` upgrade.
 */
class ConnectProxyAgent extends HttpsAgent {
    constructor(private readonly proxyPort: number) {
        super();
    }

    public createConnection(
        options: { host?: string; port?: number; servername?: string },
        callback: (err: Error | null, socket?: net.Socket) => void,
    ): void {
        const targetHost = options.host ?? "api.deepgram.com";
        const targetPort = options.port ?? 443;

        const proxySocket = net.connect(this.proxyPort, "127.0.0.1", () => {
            proxySocket.write(
                `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\n` + `Host: ${targetHost}:${targetPort}\r\n\r\n`,
            );
        });

        proxySocket.once("data", (chunk) => {
            const statusLine = chunk.toString("utf8").split("\r\n")[0];
            if (!/ 200 /.test(statusLine)) {
                callback(new Error(`Proxy CONNECT failed: ${statusLine}`));
                proxySocket.destroy();
                return;
            }
            const tlsSocket = tls.connect({ socket: proxySocket, servername: targetHost }, () => {
                callback(null, tlsSocket);
            });
            tlsSocket.on("error", (err) => callback(err));
        });

        proxySocket.on("error", (err) => callback(err));
    }
}

async function main(): Promise<void> {
    const apiKey = loadApiKey();
    const { port, close: closeProxy } = await startProxy();
    console.log(`▶ local CONNECT proxy listening on 127.0.0.1:${port}`);

    const agent = new ConnectProxyAgent(port);
    const client = new DeepgramClient({ apiKey });

    const socket = await client.listen.v1.createConnection({
        model: "nova-3",
        encoding: "linear16",
        sample_rate: 16000,
        agent,
    });

    const opened = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 15000);
        socket.on("open", () => {
            clearTimeout(timeout);
            resolve(true);
        });
        socket.on("error", (err: unknown) => {
            console.error("socket error:", err);
        });
        socket.connect();
    });

    socket.close();
    closeProxy();

    const wentThroughProxy = connectLog.some((entry) => entry.startsWith("api.deepgram.com:443"));

    console.log(`▶ proxy CONNECT log: ${JSON.stringify(connectLog)}`);
    console.log(`▶ websocket opened: ${opened}`);
    console.log(`▶ traffic transited proxy: ${wentThroughProxy}`);

    if (opened && wentThroughProxy) {
        console.log("✅ PASS — streaming WebSocket connected through the proxy agent");
        process.exit(0);
    } else {
        console.error("❌ FAIL — connection did not open through the proxy");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("❌ FAIL —", err);
    process.exit(1);
});
