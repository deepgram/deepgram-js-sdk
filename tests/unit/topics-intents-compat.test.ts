import { describe, expect, it } from "vitest";
import { DeepgramClient, type Deepgram } from "../../src";

function expectAnalysisPaths(
    results: {
        topics?: Deepgram.SharedTopics;
        intents?: Deepgram.SharedIntents;
    },
    topicSegments: unknown[],
    intentSegments: unknown[],
): void {
    const topics = results.topics;
    const intents = results.intents;
    expect(topics?.segments).toEqual(topicSegments);
    expect(intents?.segments).toEqual(intentSegments);
    expect(topics?.results?.topics?.segments).toBe(topics?.segments);
    expect(intents?.results?.intents?.segments).toBe(intents?.segments);
    expect(Object.keys(topics ?? {})).toEqual(["segments"]);
    expect(Object.keys(intents ?? {})).toEqual(["segments"]);
}

describe("Topics and Intents compatibility", () => {
    it("preserves direct and deprecated analysis paths for Listen V1 and Read V1 responses", async () => {
        const topicSegments = [{ text: "A topic", topics: [{ topic: "testing", confidence_score: 1 }] }];
        const intentSegments = [{ text: "An intent", intents: [{ intent: "verify", confidence_score: 1 }] }];
        const analysis = { topics: { segments: topicSegments }, intents: { segments: intentSegments } };
        const client = new DeepgramClient({
            apiKey: "test",
            maxRetries: 0,
            baseUrl: "https://example.test",
            fetch: async (input) => {
                const url = input instanceof Request ? input.url : input.toString();
                const body = url.endsWith("/v1/listen")
                    ? { metadata: { request_id: "listen-compat" }, results: { channels: [], ...analysis } }
                    : { metadata: { request_id: "read-compat" }, results: analysis };
                return new Response(JSON.stringify(body), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            },
        });

        const listen = await client.listen.v1.media.transcribeUrl({
            url: "https://example.com/audio.wav",
            model: "nova-3",
            topics: true,
            intents: true,
        });
        const read = await client.read.v1.text.analyze({
            body: { text: "test" },
            topics: true,
            intents: true,
        });

        const legacyTopic: Deepgram.SharedTopics.Results.Topics.Segments.Item = topicSegments[0];
        const legacyIntent: Deepgram.SharedIntents.Results.Intents.Segments.Item = intentSegments[0];
        expect([legacyTopic.text, legacyIntent.text]).toEqual(["A topic", "An intent"]);

        expectAnalysisPaths((listen as Deepgram.ListenV1Response).results, topicSegments, intentSegments);
        expectAnalysisPaths(read.results, topicSegments, intentSegments);
    });
});
