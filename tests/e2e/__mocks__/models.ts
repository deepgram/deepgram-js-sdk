/**
 * Mock response data for Models API endpoints
 */

export const mockGetAllModelsResponse = {
  stt: [
    {
      name: "nova-2-general",
      canonical_name: "nova-2-general",
      architecture: "nova-2",
      languages: ["en"],
      version: "2024-01-09",
      uuid: "f58fb2c5-4057-4aa2-a9a7-884ab2b25b48",
      batch: true,
      streaming: true,
      metadata: {
        tier: "nova",
      },
    },
    {
      name: "nova-2-phonecall",
      canonical_name: "nova-2-phonecall",
      architecture: "nova-2",
      languages: ["en"],
      version: "2024-01-09",
      uuid: "a4c682e4-d5d8-4a2b-9e6c-f7e8d3a1b2c5",
      batch: true,
      streaming: true,
      metadata: {
        tier: "nova",
      },
    },
  ],
  tts: [
    {
      name: "aura-2-thalia-en",
      canonical_name: "aura-2-thalia-en",
      architecture: "aura-2",
      languages: ["en"],
      version: "2024-01-09",
      uuid: "b7d9a3f2-1c4e-5b8a-9d6f-2e3c1a7b4d9e",
      metadata: {
        tier: "aura",
      },
    },
  ],
};

export const mockGetModelResponse = {
  name: "nova-2-general",
  canonical_name: "nova-2-general",
  architecture: "nova-2",
  languages: ["en"],
  version: "2024-01-09",
  uuid: "f58fb2c5-4057-4aa2-a9a7-884ab2b25b48",
  batch: true,
  streaming: true,
  metadata: {
    tier: "nova",
    description:
      "Nova-2 General is a powerful, fast, and accurate speech-to-text model for general use cases.",
  },
};
