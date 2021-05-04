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

  beforeEach(function () {
    requestStub = Sinon.stub(https, "request");
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

    Keys.list(fakeCredentials, fakeUrl).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("Create resolves", function () {
    nock(`https://${fakeUrl}`).post("/v2/keys").reply(200, mockKey);

    Keys.create(fakeCredentials, fakeUrl, "testLabel").then((response) => {
      response.should.deep.eq(mockKey);
      requestStub.calledOnce.should.eq(true);
    });
  });

  it("Delete resolves", function () {
    nock(`https://${fakeUrl}`).delete("/v2/keys").reply(200);

    Keys.delete(fakeCredentials, fakeUrl, "testLabel").then(() => {
      requestStub.calledOnce.should.eq(true);
    });
  });
});
