import { applySettingDefaults } from "../src/lib/helpers";
import { DeepgramClientOptions } from "../src/lib/types/DeepgramClientOptions";
import { DEFAULT_OPTIONS } from "../src/lib/constants";
import { expect } from "chai";
import { faker } from "@faker-js/faker";

describe("testing constants", () => {
  it("DEFAULT_OPTIONS are valid options", () => {
    const options: DeepgramClientOptions = DEFAULT_OPTIONS;

    expect(options).to.not.be.undefined;
  });

  it("DEFAULT_OPTIONS can be overridden", () => {
    const options = {
      global: { url: faker.internet.url({ appendSlash: false }) },
    };
    const settings = applySettingDefaults(options, DEFAULT_OPTIONS);

    expect(settings).is.not.deep.equal(options);
  });
});
