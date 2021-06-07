import chai, { assert } from "chai";
import Sinon from "sinon";
import { mockInvalidCredentials, mockKey } from "./mockResults";
import nock from "nock";
import https from "https";

import { Keys } from "../src/keys";

chai.should();

const fakeCredentials = "testKey:testSecret";
const fakeUrl = "fake.url";

describe("Key tests", () => {
  const sandbox = Sinon.createSandbox();

  let requestStub: Sinon.SinonStub;
  let keys: Keys;

  beforeEach(function () {
    requestStub = Sinon.stub(https, "request");
    keys = new Keys(fakeCredentials, fakeUrl);
  });

  afterEach(function () {
    requestStub.restore();
    nock.restore();
    sandbox.restore();
  });

  it("Errors are thrown", function () {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;

    nock(`https://${fakeUrl}`)
      .get("/v2/keys")
      .reply(200, mockInvalidCredentials);

    keys.list("projectId").catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("Create resolves", function () {
    nock(`https://${fakeUrl}`).post("/v2/keys").reply(200, mockKey);

    keys.create("projectId", "testLabel", ["project:read"]).then((response) => {
      response.should.deep.eq(mockKey);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Delete resolves", function () {
    nock(`https://${fakeUrl}`).delete("/v2/keys").reply(200);

    keys.delete("projectId", "testLabel").then(() => {
      requestStub.calledOnce.should.eq(true);
    });
  });
});
