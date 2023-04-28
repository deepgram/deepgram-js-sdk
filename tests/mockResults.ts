export const mockApiKey = "testKey";

export const mockApiSecret = "testSecret";

export const mockApiDomain = "api.deepgram.test";

export const mockProjectId = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";

export const mockRequestId = "1153a5df-ddbd-4424-ba85-920d071e18be";

export const mockEmail = "email@email.com";

export const mockScope = "read:mock";

export const mockInvalidCredentials = {
  category: "UNAUTHORIZED",
  message: "Authentication failed.",
  details: "Check that you are using the correct credentials.",
  request_id: "74d9ea89-d5fc-4c8d-9e21-b95c9b8a51c2",
};

export const mockListKeys = {
  keys: [
    {
      key: "string",
      label: "string",
    },
  ],
};

export const mockKey = {
  id: "string",
  key: "string",
  comment: "string",
  created: "string",
  scopes: ["member"],
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

export const mockBillingBalance = {
  balance_id: "uuid",
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
  tags: ["string"],
  models: ["string"],
  processing_methods: ["string"],
  languages: ["string"],
  features: ["string"],
};
