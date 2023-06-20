import { Readable } from "stream";
import {
  Project,
  ProjectPatchRequest,
  ProjectResponse,
  ReadStreamSource,
  ScopeList,
  BufferSource,
  UrlSource,
  UsageField,
  UsageFieldOptions,
  UsageOptions,
  UsageRequest,
  UsageRequestList,
  UsageRequestListOptions,
  UsageResponse,
  UsageResponseDetail,
  PrerecordedTranscriptionOptions,
  PrerecordedTranscriptionResponse,
  Metadata,
  Channel,
  Utterance,
  Search,
  Hit,
  Alternative,
  WordBase,
} from "../src/types";

export const mockApiKey = "testKey";

export const mockApiSecret = "testSecret";

export const mockApiDomain = "api.deepgram.test";

export const mockUuid = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";

export const mockProjectId = mockUuid;

export const mockRequestId = mockUuid;

export const mockEmail = "email@email.com";

export const mockScope: string = "read:mock";

export const mockTag = "string";

export const mockDate = new Date().toISOString();

export const mockInvalidCredentials = {
  category: "UNAUTHORIZED",
  message: "Authentication failed.",
  details: "Check that you are using the correct credentials.",
  request_id: mockRequestId,
};

export const mockListKeys = {
  keys: [
    {
      key: "string",
      label: "string",
    },
  ],
};

export const mockMessageResponse = {
  message: "string",
};

export const mockInvite = {
  email: mockEmail,
  scope: mockScope,
};

export const mockInvites = {
  invites: [mockInvite, mockInvite],
};

export const mockScopesList: ScopeList = {
  scopes: [mockScope, mockScope],
};

export const mockTags = [mockTag];

export const mockProjectKey = {
  member: {
    member_id: mockUuid,
    email: mockEmail,
    first_name: "string",
    last_name: "string",
  },
  api_key: {
    api_key_id: mockUuid,
    comment: "string",
    scopes: mockScopesList,
    tags: mockTags,
    created: mockDate,
    expiration_date: mockDate,
  },
};

export const mockProjectKeysList = {
  api_keys: [mockProjectKey],
};

export const mockBillingBalance = {
  balance_id: mockUuid,
  amount: 0,
  units: "string",
  purchase: "string",
};

export const mockBillingRequestList = {
  balances: [mockBillingBalance],
};

export const mockUsageRequestListOptions: UsageRequestListOptions = {
  start: "string",
  end: "string",
  page: 1,
  limit: 10,
  status: "succeeded",
};

export const mockUsageRequest: UsageRequest = {
  request_id: "string",
  created: "string",
  path: "string",
  accessor: "string",
  response: mockMessageResponse,
};

export const mockUsageRequestList: UsageRequestList = {
  page: 1,
  limit: 10,
  requests: [mockUsageRequest],
};

export const mockUsageOptions: UsageOptions = {
  start: "string",
  end: "string",
  accessor: "string",
  tag: [mockTag],
  method: "sync",
  model: "string",
  multichannel: true,
  interim_results: true,
  punctuate: true,
  ner: true,
  utterances: true,
  replace: true,
  profanity_filter: true,
  keywords: true,
  sentiment: true,
  diarize: true,
  detect_language: true,
  search: true,
  redact: true,
  alternatives: true,
  numerals: true,
  numbers: true,
  translate: true,
  detect_entities: true,
  detect_topics: true,
  summarize: true,
  paragraphs: true,
  utt_split: true,
  analyze_sentiment: true,
  smart_format: true,
  sentiment_threshold: true,
};

export const mockUsageResponseDetail: UsageResponseDetail = {
  start: "string",
  end: "string",
  hours: 1,
  requests: 1,
};

export const mockUsage: UsageResponse = {
  start: "string",
  end: "string",
  resolution: {
    units: "string",
    amount: 1,
  },
  results: [mockUsageResponseDetail],
};

export const mockUsageField: UsageField = {
  tags: [mockTag],
  models: ["string"],
  processing_methods: ["string"],
  languages: ["string"],
  features: ["string"],
};

export const mockUsageFieldOptions: UsageFieldOptions = {
  start: "string",
  end: "string",
};

export const mockMember = {
  member_id: mockUuid,
  scopes: [mockScope],
  email: mockEmail,
  first_name: "string",
  last_name: "string",
};

export const mockMembers = {
  members: [mockMember],
};

export const mockProject: Project = {
  project_id: mockUuid,
  name: "string",
  company: "string",
};

export const mockProjects: ProjectResponse = {
  projects: [mockProject],
};

export const mockProjectUpdate: ProjectPatchRequest = {
  name: "string",
  company: "string",
};

export const mockReadable = new Readable();
mockReadable._read = () => {};
mockReadable.push("string");
mockReadable.push(null);

export const mockReadStreamSource: ReadStreamSource = {
  stream: mockReadable,
  mimetype: "video/mpeg",
};

export const mockUrlSource: UrlSource = {
  url: "string",
};

export const mockBuffer: Buffer = Buffer.from("string");

export const mockBufferSource: BufferSource = {
  buffer: mockBuffer,
  mimetype: "video/mpeg",
};

export const mockPrerecordedOptions: PrerecordedTranscriptionOptions = {
  model: "nova",
  punctuate: true,
};

export const mockMetaData: Metadata = {
  request_id: "string",
  transaction_key: "string",
  sha256: "string",
  created: "string",
  duration: 1,
  channels: 1,
  model_info: {
    "b05e2505-2e49-4644-8e58-7878767ca60b": {
      name: "fake",
      version: "version",
      arch: "arch",
    },
  },
  models: ["string", "another string"],
};

export const mockHit: Hit = {
  confidence: 1,
  start: 1,
  end: 1,
  snippet: "string",
};

export const mockSearch: Search = {
  query: "string",
  hits: [mockHit],
};

export const mockWordBase: WordBase = {
  word: "string",
  start: 1,
  end: 1,
  confidence: 1,
};

export const mockAlternative: Alternative = {
  transcript: "string",
  confidence: 1,
  words: [mockWordBase],
};

export const mockChannel: Channel = {
  search: [mockSearch],
  alternatives: [mockAlternative],
  detected_language: "string",
};

export const mockPrerecordedResponse = {
  request_id: mockUuid,
  metadata: mockMetaData,
  results: {
    channels: [mockChannel],
  },
};
