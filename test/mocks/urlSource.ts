import { faker } from "@faker-js/faker";
import { UrlSource } from "../../src/lib/types/PreRecordedSource";

const urlSource: UrlSource = {
  url: faker.internet.url({ appendSlash: false }) + "/nasa.wav",
};

export default urlSource;
