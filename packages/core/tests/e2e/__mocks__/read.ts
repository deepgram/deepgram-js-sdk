/**
 * Mock response data for Read API endpoints
 */

import type { AsyncAnalyzeResponse } from "../../../src/lib/types";

export const mockAnalyzeTextResponse = {
  metadata: {
    request_id: "mock-request-id-123",
    created: "2024-01-09T10:00:00.000Z",
    language: "en",
    intents: {
      model_uuid: "mock-intents-model-uuid",
      model_name: "intent-classifier-v1",
      model_metadata: {},
    },
    sentiment: {
      model_uuid: "mock-sentiment-model-uuid",
      model_name: "sentiment-analyzer-v1",
      model_metadata: {},
    },
    summary: {
      model_uuid: "mock-summary-model-uuid",
      model_name: "text-summarizer-v1",
      model_metadata: {},
    },
  },
  results: {
    intents: {
      segments: [
        {
          text: "Hello world, this is a test.",
          start_word: 0,
          end_word: 6,
          intents: [
            {
              intent: "greeting",
              confidence: 0.95,
            },
          ],
        },
      ],
    },
    sentiments: {
      segments: [
        {
          text: "Hello world, this is a test.",
          start_word: 0,
          end_word: 6,
          sentiment: "neutral",
          sentiment_score: 0.0,
        },
      ],
      average: {
        sentiment: "neutral",
        sentiment_score: 0.0,
      },
    },
    summary: {
      short: "A simple test greeting message.",
    },
  },
};

export const mockAnalyzeUrlResponse = {
  metadata: {
    request_id: "mock-request-id-456",
    created: "2024-01-09T10:00:00.000Z",
    language: "en",
    intents: {
      model_uuid: "mock-intents-model-uuid",
      model_name: "intent-classifier-v1",
      model_metadata: {},
    },
    sentiment: {
      model_uuid: "mock-sentiment-model-uuid",
      model_name: "sentiment-analyzer-v1",
      model_metadata: {},
    },
    summary: {
      model_uuid: "mock-summary-model-uuid",
      model_name: "text-summarizer-v1",
      model_metadata: {},
    },
  },
  results: {
    intents: {
      segments: [
        {
          text: "Content from URL source for analysis.",
          start_word: 0,
          end_word: 6,
          intents: [
            {
              intent: "informational",
              confidence: 0.87,
            },
          ],
        },
      ],
    },
    sentiments: {
      segments: [
        {
          text: "Content from URL source for analysis.",
          start_word: 0,
          end_word: 6,
          sentiment: "neutral",
          sentiment_score: 0.1,
        },
      ],
      average: {
        sentiment: "neutral",
        sentiment_score: 0.1,
      },
    },
    summary: {
      short: "Analysis of content from a URL source.",
    },
  },
};

export const mockAsyncAnalyzeResponse = {
  request_id: "mock-async-request-id-789",
};

export const mockAsyncReadUrlResponse: AsyncAnalyzeResponse = {
  request_id: "async-read-550e8400-e29b-41d4-a716-446655440004",
};

export const mockAsyncReadTextResponse: AsyncAnalyzeResponse = {
  request_id: "async-read-550e8400-e29b-41d4-a716-446655440005",
};
