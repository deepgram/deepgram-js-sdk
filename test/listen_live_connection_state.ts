import { expect } from "chai";
import { LiveConnectionState } from "../src/lib/enums/LiveConnectionState";
import { SOCKET_STATES } from "../src/lib/constants";

describe("LiveConnectionState", () => {
  it("should have the correct values", () => {
    expect(LiveConnectionState.CONNECTING).to.equal(SOCKET_STATES.connecting);
    expect(LiveConnectionState.OPEN).to.equal(SOCKET_STATES.open);
    expect(LiveConnectionState.CLOSING).to.equal(SOCKET_STATES.closing);
    expect(LiveConnectionState.CLOSED).to.equal(SOCKET_STATES.closed);
  });

  it("should have unique values", () => {
    const values = Object.values(LiveConnectionState);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).to.equal(values.length);
  });
});
