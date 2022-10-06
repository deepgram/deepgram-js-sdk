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
