import { describe, expect, it } from "vitest";
import { getHeader } from "../../../src/core/fetcher/getHeader.js";
import { getResponseBody } from "../../../src/core/fetcher/getResponseBody.js";
import { encodePathParam } from "../../../src/core/url/encodePathParam.js";
import { CloseEvent, ErrorEvent, Event } from "../../../src/core/websocket/events.js";

describe("getHeader", () => {
    it("finds headers case-insensitively", () => {
        const headers = { "Content-Type": "application/json", "X-Custom": "value" };
        expect(getHeader(headers, "content-type")).toBe("application/json");
        expect(getHeader(headers, "X-CUSTOM")).toBe("value");
    });

    it("returns undefined when the header is absent", () => {
        expect(getHeader({ a: "1" }, "missing")).toBeUndefined();
    });
});

describe("encodePathParam", () => {
    it("handles null and undefined", () => {
        expect(encodePathParam(null)).toBe("null");
        expect(encodePathParam(undefined)).toBe("undefined");
    });

    it("encodes primitives", () => {
        expect(encodePathParam("a b/c")).toBe("a%20b%2Fc");
        expect(encodePathParam(42)).toBe("42");
        expect(encodePathParam(true)).toBe("true");
    });

    it("stringifies non-primitive values", () => {
        expect(encodePathParam({ toString: () => "obj id" })).toBe("obj%20id");
    });
});

describe("getResponseBody", () => {
    it("parses JSON by default", async () => {
        const res = new Response(JSON.stringify({ hello: "world" }));
        expect(await getResponseBody(res)).toEqual({ hello: "world" });
    });

    it("returns undefined for an empty body", async () => {
        const res = new Response("");
        expect(await getResponseBody(res)).toBeUndefined();
    });

    it("returns a non-json error for unparseable JSON", async () => {
        const res = new Response("not json {");
        const body = (await getResponseBody(res)) as { ok: boolean; error: { reason: string } };
        expect(body.ok).toBe(false);
        expect(body.error.reason).toBe("non-json");
    });

    it("returns text when responseType is text", async () => {
        const res = new Response("plain text");
        expect(await getResponseBody(res, "text")).toBe("plain text");
    });

    it("returns a blob and arrayBuffer", async () => {
        expect(await getResponseBody(new Response("x"), "blob")).toBeInstanceOf(Blob);
        expect(await getResponseBody(new Response("x"), "arrayBuffer")).toBeInstanceOf(ArrayBuffer);
    });

    it("returns the stream for sse and streaming responses", async () => {
        const sse = await getResponseBody(new Response("data: x\n\n"), "sse");
        expect(sse).toBeInstanceOf(ReadableStream);
        const streaming = await getResponseBody(new Response("chunk"), "streaming");
        expect(streaming).toBeInstanceOf(ReadableStream);
    });

    it("returns a body-is-null error when sse/streaming bodies are null", async () => {
        const sse = (await getResponseBody(new Response(null), "sse")) as { error: { reason: string } };
        expect(sse.error.reason).toBe("body-is-null");
        const streaming = (await getResponseBody(new Response(null), "streaming")) as {
            error: { reason: string };
        };
        expect(streaming.error.reason).toBe("body-is-null");
    });
});

describe("websocket events", () => {
    it("constructs a base Event", () => {
        const target = { id: 1 };
        const event = new Event("custom", target);
        expect(event.type).toBe("custom");
        expect(event.target).toBe(target);
    });

    it("constructs an ErrorEvent from an Error", () => {
        const err = new Error("boom");
        const event = new ErrorEvent(err, null);
        expect(event.type).toBe("error");
        expect(event.message).toBe("boom");
        expect(event.error).toBe(err);
    });

    it("constructs a CloseEvent with defaults and custom values", () => {
        const def = new CloseEvent(undefined, undefined, null);
        expect(def.type).toBe("close");
        expect(def.code).toBe(1000);
        expect(def.reason).toBe("");
        expect(def.wasClean).toBe(true);

        const custom = new CloseEvent(1006, "abnormal", null);
        expect(custom.code).toBe(1006);
        expect(custom.reason).toBe("abnormal");
    });
});
