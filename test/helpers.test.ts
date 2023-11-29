import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { applySettingDefaults, stripTrailingSlash } from "../src/lib/helpers";
import { DEFAULT_OPTIONS } from "../src/lib/constants";

describe("testing helpers", () => {
  it("it should strip the trailing slash from a URL", () => {
    const URL = faker.internet.url({ appendSlash: true });
    const expectedURL = URL.slice(0, -1);
    expect(stripTrailingSlash(URL)).to.equal(expectedURL);
  });

  it("it should override defaults with options provided", () => {
    const options = JSON.parse(JSON.stringify(DEFAULT_OPTIONS)); // deep copy DEFAULT_OPTIONS
    options.global.url = faker.internet.url({ appendSlash: false });
    expect(applySettingDefaults(options, DEFAULT_OPTIONS)).to.deep.equal(options);
  });
});
