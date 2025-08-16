/**
 * Mock responses for Manage API endpoints
 */

import type {
  GetProjectsResponse,
  GetProjectResponse,
  MessageResponse,
  GetProjectKeysResponse,
  GetProjectKeyResponse,
  CreateProjectKeyResponse,
  GetProjectMembersResponse,
  GetProjectMemberScopesResponse,
  GetProjectInvitesResponse,
  GetProjectUsageRequestsResponse,
  GetProjectUsageRequestResponse,
  GetProjectUsageSummaryResponse,
  GetProjectUsageFieldsResponse,
  GetProjectBalancesResponse,
  GetProjectBalanceResponse,
  GetModelsResponse,
  GetModelResponse,
  GetTokenDetailsResponse,
  VoidResponse,
} from "../../../src/core/lib/types";

// Projects
export const mockGetProjectsResponse: GetProjectsResponse = {
  projects: [
    {
      project_id: "test-project-123",
      name: "Test Project",
    },
    {
      project_id: "test-project-456",
      name: "Another Project",
    },
  ],
};

export const mockGetProjectResponse: GetProjectResponse = {
  project_id: "test-project-123",
  name: "Test Project",
  company: "Test Company",
};

export const mockUpdateProjectResponse: MessageResponse = {
  message: "Project updated successfully",
};

export const mockLeaveProjectResponse: MessageResponse = {
  message: "Successfully left project",
};

// Keys
export const mockGetProjectKeysResponse: GetProjectKeysResponse = {
  api_keys: [
    {
      member: {
        member_id: "test-member-123",
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
      },
      api_key: {
        api_key_id: "test-key-123",
        comment: "Test API key",
        scopes: ["usage:write", "usage:read"],
        created: "2024-01-01T00:00:00.000Z",
      },
    },
    {
      member: {
        member_id: "test-member-456",
        email: "another@example.com",
        first_name: "Another",
        last_name: "User",
      },
      api_key: {
        api_key_id: "test-key-456",
        comment: "Another API key",
        scopes: ["usage:read"],
        created: "2024-01-02T00:00:00.000Z",
      },
    },
  ],
};

export const mockGetProjectKeyResponse: GetProjectKeyResponse = {
  member: {
    member_id: "test-member-123",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
  },
  api_key: {
    api_key_id: "test-key-123",
    comment: "Test API key",
    scopes: ["usage:write", "usage:read"],
    created: "2024-01-01T00:00:00.000Z",
  },
};

export const mockCreateProjectKeyResponse: CreateProjectKeyResponse = {
  api_key_id: "test-key-new-789",
  key: "ak_test_key_1234567890abcdef",
  comment: "Test API key for e2e testing",
  scopes: ["usage:write", "usage:read"],
  created: "2024-01-01T00:00:00.000Z",
};

// Members
export const mockGetProjectMembersResponse: GetProjectMembersResponse = {
  members: [
    {
      member_id: "test-member-123",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      scopes: ["admin"],
    },
    {
      member_id: "test-member-456",
      email: "another@example.com",
      first_name: "Another",
      last_name: "User",
      scopes: ["member"],
    },
  ],
};

export const mockGetProjectMemberScopesResponse: GetProjectMemberScopesResponse = {
  scopes: ["member"],
};

export const mockUpdateProjectMemberScopeResponse: MessageResponse = {
  message: "Member scope updated successfully",
};

// Invites
export const mockGetProjectInvitesResponse: GetProjectInvitesResponse = {
  invites: [
    {
      email: "invited@example.com",
      scope: "member",
    },
  ],
};

export const mockSendProjectInviteResponse: MessageResponse = {
  message: "Invite sent successfully",
};

// Usage Requests
export const mockGetProjectUsageRequestsResponse: GetProjectUsageRequestsResponse = {
  page: 0,
  limit: 10,
  requests: [
    {
      request_id: "test-request-123",
      created: "2024-01-01T00:00:00.000Z",
      path: "/v1/listen",
      api_key_id: "test-key-123",
      response: {
        code: 200,
        completed: "2024-01-01T00:00:05.000Z",
        details: {
          usd: 0.0045,
          duration: 30.5,
          total_audio: 30.5,
          channels: 1,
          models: ["nova-2"],
          method: "POST",
        },
      },
    },
    {
      request_id: "test-request-456",
      created: "2024-01-01T01:00:00.000Z",
      path: "/v1/speak",
      api_key_id: "test-key-123",
      response: {
        code: 200,
        completed: "2024-01-01T01:00:02.000Z",
        details: {
          usd: 0.002,
          models: ["aura-thalia-en"],
          method: "POST",
        },
      },
    },
  ],
};

export const mockGetProjectUsageRequestResponse: GetProjectUsageRequestResponse = {
  request_id: "test-request-123",
  created: "2024-01-01T00:00:00.000Z",
  path: "/v1/listen",
  api_key_id: "test-key-123",
  response: {
    code: 200,
    completed: "2024-01-01T00:00:05.000Z",
    details: {
      usd: 0.0045,
      duration: 30.5,
      total_audio: 30.5,
      channels: 1,
      models: ["nova-2"],
      method: "POST",
    },
  },
};

export const mockGetProjectUsageSummaryResponse: GetProjectUsageSummaryResponse = {
  start: "2024-01-01",
  end: "2024-01-31",
  resolution: {
    units: "day",
    amount: 1,
  },
  results: [
    {
      start: "2024-01-01",
      end: "2024-01-31",
      hours: 10.5,
      total_hours: 10.5,
      requests: 50,
    },
  ],
};

export const mockGetProjectUsageFieldsResponse: GetProjectUsageFieldsResponse = {
  tags: ["test", "production"],
  models: [],
  processing_methods: ["sync", "async"],
  languages: ["en", "es", "fr"],
  features: ["smart_format", "punctuate", "diarize"],
};

// Balances
export const mockGetProjectBalancesResponse: GetProjectBalancesResponse = {
  balances: [
    {
      balance_id: "test-balance-123",
      amount: 100.5,
      units: "usd",
      purchase: "test-purchase-123",
    },
    {
      balance_id: "test-balance-456",
      amount: 50.25,
      units: "usd",
      purchase: "test-purchase-456",
    },
  ],
};

export const mockGetProjectBalanceResponse: GetProjectBalanceResponse = {
  balance_id: "test-balance-123",
  amount: 100.5,
  units: "usd",
  purchase: "test-purchase-123",
};

// Project-scoped Models (simplified)
export const mockGetAllProjectModelsResponse: GetModelsResponse = {
  stt: [
    {
      name: "nova-2",
      canonical_name: "nova-2-general",
      architecture: "nova-2",
      languages: ["en"],
      version: "2024-01-01",
      uuid: "model-uuid-123",
    },
  ],
  tts: [
    {
      name: "aura-thalia-en",
      canonical_name: "aura-thalia-en",
      architecture: "aura",
      languages: ["en"],
      version: "2024-01-01",
      uuid: "model-uuid-456",
    },
  ],
};

export const mockGetProjectModelResponse: GetModelResponse = {
  name: "nova-2",
  canonical_name: "nova-2-general",
  architecture: "nova-2",
  languages: ["en"],
  version: "2024-01-01",
  uuid: "model-uuid-123",
};

// Token Details
export const mockGetTokenDetailsResponse: GetTokenDetailsResponse = {
  api_key_id: "test-key-123",
  scopes: ["usage:write", "usage:read"],
  created: "2024-01-01T00:00:00.000Z",
};

// Generic void/delete responses
export const mockDeleteProjectResponse: VoidResponse = {
  error: null,
};

export const mockDeleteProjectKeyResponse: VoidResponse = {
  error: null,
};

export const mockRemoveProjectMemberResponse: VoidResponse = {
  error: null,
};

export const mockDeleteProjectInviteResponse: VoidResponse = {
  error: null,
};

// Note: Other message responses already exist below in the file
