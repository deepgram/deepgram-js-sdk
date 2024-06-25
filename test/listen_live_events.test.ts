import { expect } from "chai";
import { LiveTranscriptionEvents } from "../src/lib/enums/LiveTranscriptionEvents";

describe("LiveTranscriptionEvents", () => {
  it("should have the correct values for built-in socket events", () => {
    expect(LiveTranscriptionEvents.Open).to.equal("open");
    expect(LiveTranscriptionEvents.Close).to.equal("close");
    expect(LiveTranscriptionEvents.Error).to.equal("error");
  });

  it("should have the correct values for message events", () => {
    expect(LiveTranscriptionEvents.Transcript).to.equal("Results");
    expect(LiveTranscriptionEvents.Metadata).to.equal("Metadata");
    expect(LiveTranscriptionEvents.UtteranceEnd).to.equal("UtteranceEnd");
    expect(LiveTranscriptionEvents.SpeechStarted).to.equal("SpeechStarted");
  });

  it("should have the correct value for unhandled events", () => {
    expect(LiveTranscriptionEvents.Unhandled).to.equal("Unhandled");
  });

  it("should have unique values for all events", () => {
    const values = Object.values(LiveTranscriptionEvents);
    const uniqueValues = new Set(values);
    expect(values.length).to.equal(uniqueValues.size);
  });
});
