import { faker } from "@faker-js/faker";
import { UrlSource } from "../../src/lib/types/PrerecordedSource";

const urlSource: UrlSource = {
  url: faker.internet.url({ appendSlash: false }) + "/nasa.wav",
};

export default urlSource;
