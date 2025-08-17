/**
 * Mock response data for Self-hosted API endpoints
 */

export const mockListCredentialsResponse = {
  distribution_credentials: [
    {
      member: {
        member_id: "test-member-123",
        email: "test@example.com",
      },
      distribution_credentials: {
        distribution_credentials_id: "test-credential-123",
        comment: "Test credentials for development",
        scopes: ["usage:write", "keys:read"],
        provider: "test-provider",
        created: "2024-01-09T10:00:00.000Z",
      },
    },
    {
      member: {
        member_id: "test-member-456",
        email: "prod@example.com",
      },
      distribution_credentials: {
        distribution_credentials_id: "test-credential-456",
        comment: "Production credentials",
        scopes: ["usage:write"],
        provider: "prod-provider",
        created: "2024-01-08T10:00:00.000Z",
      },
    },
  ],
};

export const mockGetCredentialsResponse = {
  member: {
    member_id: "test-member-123",
    email: "test@example.com",
  },
  distribution_credentials: {
    distribution_credentials_id: "test-credential-123",
    comment: "Test credentials for development",
    scopes: ["usage:write", "keys:read"],
    provider: "test-provider",
    created: "2024-01-09T10:00:00.000Z",
  },
};

export const mockCreateCredentialsResponse = {
  member: {
    member_id: "test-member-new",
    email: "new@example.com",
  },
  distribution_credentials: {
    distribution_credentials_id: "test-credential-new-789",
    comment: "Test credentials for e2e testing",
    scopes: ["usage:write"],
    provider: "test-provider",
    created: "2024-01-09T11:00:00.000Z",
  },
};

export const mockDeleteCredentialsResponse = {
  message: "Credentials successfully deleted",
};
