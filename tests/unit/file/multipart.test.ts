import { describe, expect, it } from "vitest";
import { toBinaryUploadRequest, toMultipartDataPart } from "../../../src/core/file/index";

function destroyBody(body: unknown): void {
    (body as { destroy?: () => void })?.destroy?.();
}

describe("toMultipartDataPart", () => {
    it("derives filename and contentType from a Blob, without sniffing size", async () => {
        const blob = new Blob(["audio"], { type: "audio/wav" });
        const part = await toMultipartDataPart({ data: blob, filename: "clip.wav" });
        expect(part.filename).toBe("clip.wav");
        expect(part.contentType).toBe("audio/wav");
        expect(part.data).toBe(blob);
    });

    it("falls back to a File's intrinsic name and type", async () => {
        const file = new File(["x"], "speech.mp3", { type: "audio/mpeg" });
        const part = await toMultipartDataPart(file);
        expect(part.filename).toBe("speech.mp3");
        expect(part.contentType).toBe("audio/mpeg");
    });

    it("handles a raw Buffer with no metadata", async () => {
        const part = await toMultipartDataPart(Buffer.from("data"));
        expect(part.filename).toBeUndefined();
        expect(part.contentType).toBeUndefined();
        expect(Buffer.isBuffer(part.data)).toBe(true);
    });
});

describe("file upload error handling", () => {
    it("throws for an object that is neither file-like, pathed, nor data-bearing", async () => {
        await expect(toBinaryUploadRequest({} as never)).rejects.toThrow("Invalid FileUpload");
        await expect(toMultipartDataPart({} as never)).rejects.toThrow("Invalid FileUpload");
    });
});

describe("file path uploads", () => {
    it("derives the filename from a path and sniffs the size for a binary upload", async () => {
        const request = await toBinaryUploadRequest({ path: "package.json" });
        expect(request.headers?.["Content-Disposition"]).toContain('filename="package.json"');
        // size was sniffed from disk
        expect(request.headers?.["Content-Length"]).toBeDefined();
        destroyBody(request.body);
    });

    it("extracts the basename from a nested path", async () => {
        const request = await toBinaryUploadRequest({ path: "src/index.ts", contentLength: 123 });
        expect(request.headers?.["Content-Disposition"]).toContain('filename="index.ts"');
        // explicit contentLength short-circuits the disk sniff
        expect(request.headers?.["Content-Length"]).toBe("123");
        destroyBody(request.body);
    });

    it("skips size sniffing for multipart path parts", async () => {
        const part = await toMultipartDataPart({ path: "package.json", filename: "custom.json" });
        expect(part.filename).toBe("custom.json");
        destroyBody(part.data);
    });

    it("reads intrinsic size and type from a File for a binary upload", async () => {
        const file = new File(["abcd"], "clip.wav", { type: "audio/wav" });
        const request = await toBinaryUploadRequest(file);
        expect(request.headers?.["Content-Type"]).toBe("audio/wav");
        expect(request.headers?.["Content-Length"]).toBe("4");
    });
});

describe("stream-like uploads", () => {
    it("derives a filename and attempts a size sniff from a stream that carries a path", async () => {
        // Stream-like (has `read`) with a `.path`, like an fs.ReadStream.
        const streamWithPath = { read() {}, path: "recordings/take-1.wav" };
        const request = await toBinaryUploadRequest({ data: streamWithPath } as never);
        expect(request.headers?.["Content-Disposition"]).toContain('filename="take-1.wav"');
        // the path does not exist, so the size sniff resolves to undefined
        expect(request.headers?.["Content-Length"]).toBeUndefined();
    });

    it("skips size sniffing for a path-less stream in multipart mode", async () => {
        const stream = { pipe() {} };
        const part = await toMultipartDataPart({ data: stream } as never);
        expect(part.filename).toBeUndefined();
        expect(part.contentType).toBeUndefined();
    });
});
