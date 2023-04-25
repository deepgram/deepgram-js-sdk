export const mockInvalidCredentials = {
  error: "Unauthorized",
  reason: "Invalid or missing credentials.",
  transaction_key:
    "cAQ7O8zj1aasdfajxJLB3XKV6UWuDFP9BY6xPBn8XwHIg1v44BW3OeqiRNzRTD7bR91ftt/dUOiW5ZyfizfD6D5jHcRoLf6qRVznV4lGo80gYA63UpN/ieQO4DRXN4OxWq/oSwFRdQo+WZcfom57+RUTew3RJSpZnawYPvhcn5zwrBgVf0rcz+nzRFdm7JAE4hZ5hVonO5gDOPWc=",
  request_id: "Yjradagaga0eilP713sCYoCxV1",
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

export const mockInvites = {
  invites: [
    {
      email: "mock@email.com",
      scope: "mockScope",
    },
    {
      email: "anotherMock@email.com",
    },
  ],
};

export const mockScopesList = {
  scopes: ["string", "string"],
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
