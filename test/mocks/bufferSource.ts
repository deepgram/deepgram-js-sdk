import { BufferSource } from "../../src/lib/types/PreRecordedSource";

export const mockBuffer: Buffer = Buffer.from("string");

const bufferSource: BufferSource = {
  buffer: mockBuffer,
  mimetype: "video/mpeg",
};

export default bufferSource;
