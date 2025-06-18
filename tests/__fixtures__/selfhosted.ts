/**
 * Test fixtures for Selfhosted API
 */

/**
 * Test project IDs for management operations (mock IDs for testing)
 */
export const testProjectIds = {
  primary: "test-project-123",
  secondary: "test-project-456",
} as const;

/**
 * Test credentials for self-hosted operations
 */
export const testCredentials = {
  createOptions: {
    comment: "Test credentials for e2e testing",
    scopes: ["usage:write"] as string[],
  },
  credentialId: "test-credential-123",
} as const;
