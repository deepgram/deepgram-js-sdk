/**
 * Mock response for transcribeUrl API endpoint
 * Based on actual Deepgram API response structure
 */
export const mockTranscribeUrlResponse = {
  metadata: {
    transaction_key: "mock-transaction-key",
    request_id: "mock-request-id-1234",
    sha256: "mock-sha256-hash",
    created: "2024-01-15T10:30:00.000Z",
    duration: 25.933313,
    channels: 1,
    models: ["mock-model-uuid"],
    model_info: {
      "mock-model-uuid": {
        name: "general-nova-3",
        version: "2024-01-01.0",
        arch: "nova-3",
      },
    },
  },
  results: {
    channels: [
      {
        alternatives: [
          {
            transcript:
              "Yeah. As much as it's worth celebrating the first spacewalk with an all female team, I think many of us are looking forward to it just being normal. And I think if it signifies anything, it is to honor the women who came before us who were skilled and qualified and didn't get the same opportunities that we have today.",
            confidence: 0.9983989,
            words: [
              {
                word: "yeah",
                start: 0.0,
                end: 0.48,
                confidence: 0.99592936,
                punctuated_word: "Yeah.",
              },
              {
                word: "as",
                start: 0.48,
                end: 0.64,
                confidence: 0.994148,
                punctuated_word: "As",
              },
              {
                word: "much",
                start: 1.12,
                end: 1.36,
                confidence: 0.99942505,
                punctuated_word: "much",
              },
              // Truncated for brevity - this would contain all words
            ],
            paragraphs: {
              transcript:
                "Yeah. As much as it's worth celebrating the first spacewalk with an all female team, I think many of us are looking forward to it just being normal. And I think if it signifies anything, it is to honor the women who came before us who were skilled and qualified and didn't get the same opportunities that we have today.",
              paragraphs: [
                {
                  sentences: [
                    {
                      text: "Yeah.",
                      start: 0.0,
                      end: 0.48,
                    },
                    {
                      text: "As much as it's worth celebrating the first spacewalk with an all female team, I think many of us are looking forward to it just being normal.",
                      start: 0.48,
                      end: 12.4,
                    },
                    {
                      text: "And I think if it signifies anything, it is to honor the women who came before us who were skilled and qualified and didn't get the same opportunities that we have today.",
                      start: 12.795,
                      end: 25.355,
                    },
                  ],
                  start: 0.0,
                  end: 25.355,
                  num_words: 62,
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
