import { Readable } from "stream";
import { ReadStreamSource } from "../../src/lib/types/PreRecordedSource";

export const mockReadable = new Readable();
mockReadable._read = () => {};
mockReadable.push("string");
mockReadable.push(null);

const readStreamSource: ReadStreamSource = {
  stream: mockReadable,
  mimetype: "video/mpeg",
};

export default readStreamSource;
