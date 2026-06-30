import { describe, expect, it } from "vitest";
import { toBinaryUploadRequest, toMultipartDataPart } from "../../../src/core/file/index";

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
