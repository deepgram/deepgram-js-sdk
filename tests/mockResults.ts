import { Project, ProjectPatchRequest, ProjectResponse } from "../src/types";

export const mockApiKey = "testKey";

export const mockApiSecret = "testSecret";

export const mockApiDomain = "api.deepgram.test";

export const mockUuid = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";

export const mockProjectId = mockUuid;

export const mockRequestId = mockUuid;

export const mockEmail = "email@email.com";

export const mockScope = "read:mock";

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

export const mockScopesList = {
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

export const mockUsageRequest = {
  request_id: "string",
  created: "string",
  path: "string",
  accessor: "string",
};

export const mockUsageRequestList = {
  page: 1,
  limit: 42,
  requests: [mockUsageRequest],
};

export const mockUsageResponseDetail = {
  start: "string",
  end: "string",
  hours: 42,
  requests: 42,
};

export const mockUsageResponse = {
  start: "string",
  end: "string",
  resolution: {
    units: "string",
    amount: 42,
  },
  results: [mockUsageResponseDetail],
};

export const mockUsageField = {
  tags: mockTags,
  models: ["string"],
  processing_methods: ["string"],
  languages: ["string"],
  features: ["string"],
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
