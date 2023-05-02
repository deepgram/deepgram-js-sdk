import {
  Project,
  ProjectPatchRequest,
  ProjectResponse,
  ScopeList,
  UsageField,
  UsageFieldOptions,
  UsageOptions,
  UsageRequest,
  UsageRequestList,
  UsageRequestListOptions,
  UsageResponse,
  UsageResponseDetail,
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
