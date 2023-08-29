import { BufferSource } from "../../src/lib/types/PrerecordedSource";

export const mockBuffer: Buffer = Buffer.from("string");

const bufferSource: BufferSource = {
  buffer: mockBuffer,
  mimetype: "video/mpeg",
};

export default bufferSource;
