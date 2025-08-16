import { createClient, ListenV2 } from "../../src/sdk";
import { LiveTranscriptionEvents } from "../../src/core/lib/enums/LiveTranscriptionEvents";

describe("SDK Enhanced Features", () => {
  describe("ListenV2 Middleware", () => {
    it("should allow global middleware registration", () => {
      expect(() => {
        ListenV2.use({
          event: "Results",
          before: (payload) => {
            payload.enhanced = true;
          },
          after: (payload) => {
            console.log("Processed:", payload.enhanced);
          },
        });
      }).not.toThrow();
    });
  });

  describe("Enhanced DeepgramClient", () => {
    it("should create client with same interface as core", () => {
      const client = createClient({ key: "test-key" });

      expect(client).toBeDefined();
      expect(client.listen).toBeDefined();
      expect(client.auth).toBeDefined();
      expect(client.manage).toBeDefined();
      expect(client.speak).toBeDefined();
      expect(client.read).toBeDefined();
      expect(client.models).toBeDefined();
      expect(client.selfhosted).toBeDefined();
    });

    it("should have version method", () => {
      const client = createClient({ key: "test-key" });

      expect(typeof client.v).toBe("function");
      expect(client.v("v2")).toBe(client);
    });

    it("should create listen live client", () => {
      const client = createClient({ key: "test-key" });

      expect(() => {
        const connection = client.listen.live({ model: "nova-3" });
        expect(connection).toBeDefined();
      }).not.toThrow();
    });

    it("should create v2 listen live client with supervision", () => {
      const client = createClient({ key: "test-key" });

      expect(() => {
        const connection = client.v("v2").listen.live({ model: "nova-3" });
        expect(connection).toBeDefined();

        // Should have the enhanced use method for instance middleware
        expect(typeof (connection as any).use).toBe("function");
      }).not.toThrow();
    });

    it("should allow instance middleware on v2 connections", () => {
      const client = createClient({ key: "test-key" });
      const connection = client.v("v2").listen.live({ model: "nova-3" });

      expect(() => {
        (connection as any).use({
          event: "SpeechStarted",
          before: () => console.log("User started speaking"),
        });
      }).not.toThrow();
    });
  });

  describe("Event Compatibility", () => {
    it("should export all original events", () => {
      expect(LiveTranscriptionEvents.Open).toBe("open");
      expect(LiveTranscriptionEvents.Close).toBe("close");
      expect(LiveTranscriptionEvents.Error).toBe("error");
      expect(LiveTranscriptionEvents.Transcript).toBe("Results");
      expect(LiveTranscriptionEvents.Metadata).toBe("Metadata");
      expect(LiveTranscriptionEvents.UtteranceEnd).toBe("UtteranceEnd");
      expect(LiveTranscriptionEvents.SpeechStarted).toBe("SpeechStarted");
    });
  });
});
