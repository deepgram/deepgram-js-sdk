/**
 * Test fixtures for Manage API (Project Management)
 */

/**
 * Test project IDs for management operations
 */
export const testProjectIds = {
  primary: "test-project-123",
  secondary: "test-project-456",
  toDelete: "test-project-789",
} as const;

/**
 * Test member IDs for member management operations
 */
export const testMemberIds = {
  member1: "test-member-123",
  member2: "test-member-456",
  toRemove: "test-member-789",
} as const;

/**
 * Test API key IDs for key management operations
 */
export const testKeyIds = {
  key1: "test-key-123",
  key2: "test-key-456",
  toDelete: "test-key-789",
} as const;

/**
 * Test balance IDs for balance operations
 */
export const testBalanceIds = {
  balance1: "test-balance-123",
  balance2: "test-balance-456",
} as const;

/**
 * Test request IDs for usage operations
 */
export const testRequestIds = {
  request1: "test-request-123",
  request2: "test-request-456",
} as const;

/**
 * Project creation/update options
 */
export const projectOptions = {
  create: {
    name: "Test Project",
    company: "Test Company",
  },
  update: {
    name: "Updated Test Project",
    company: "Updated Test Company",
  },
} as const;

/**
 * API key creation options
 */
export const keyOptions = {
  create: {
    comment: "Test API key for e2e testing",
    scopes: ["usage:write", "usage:read"],
  },
  createMinimal: {
    comment: "Minimal test key",
    scopes: [],
  },
};

/**
 * Member scope update options
 */
export const memberScopeOptions = {
  update: {
    scope: "member" as const,
  },
  updateAdmin: {
    scope: "admin" as const,
  },
} as const;

/**
 * Project invitation options
 */
export const inviteOptions = {
  single: {
    email: "test@example.com",
    scope: "member",
  },
  multiple: {
    email: "test-bulk@example.com", // API may support bulk but type shows single
    scope: "member",
  },
};

/**
 * Usage request query options
 */
export const usageRequestOptions = {
  basic: {
    start: "2024-01-01",
    end: "2024-01-31",
  },
  withLimit: {
    start: "2024-01-01",
    end: "2024-01-31",
    limit: 10,
  },
  withPagination: {
    start: "2024-01-01",
    end: "2024-01-31",
    limit: 5,
    page: 1,
  },
} as const;

/**
 * Usage summary query options
 */
export const usageSummaryOptions = {
  basic: {
    start: "2024-01-01",
    end: "2024-01-31",
  },
  withFilters: {
    start: "2024-01-01",
    end: "2024-01-31",
    accessor: "streaming",
    tag: "test",
    method: "POST",
    model: "nova-2",
  },
} as const;

/**
 * Usage fields query options
 */
export const usageFieldsOptions = {
  basic: {
    start: "2024-01-01",
    end: "2024-01-31",
  },
  withFilters: {
    start: "2024-01-01",
    end: "2024-01-31",
    include_tags: true,
  },
} as const;

/**
 * Test model IDs for project-scoped model operations
 */
export const testModelIds = {
  sttModel: "nova-2",
  ttsModel: "aura-thalia-en",
  customModel: "custom-model-123",
} as const;

/**
 * Test email addresses for invite operations
 */
export const testEmails = {
  toInvite: "test@example.com",
  toDelete: "invited@example.com",
  bulk: "test-bulk@example.com",
} as const;

/**
 * Project-scoped model query options
 */
export const modelOptions = {
  basic: {},
  withFilters: {
    includeOutdated: false,
  },
} as const;
