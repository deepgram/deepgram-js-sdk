/**
 * Example: Member Permissions Management
 *
 * Demonstrates project member and permission management including:
 * - Listing project members
 * - Getting member scopes/permissions
 * - Updating member scopes
 * - Managing member invitations
 * - Removing members from projects
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = process.env.DEEPGRAM_PROJECT_ID;

// Example 1: List all project members
async function listProjectMembers() {
  console.log("\n=== Project Members ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.members.list(
      projectId,
    );

    console.log("Project members:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Get member scopes (permissions)
async function getMemberScopes(memberId) {
  console.log("\n=== Member Scopes/Permissions ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.members.scopes.list(
      projectId,
      memberId,
    );

    console.log(`Scopes for member ${memberId}:`);
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Update member scopes to admin
async function promoteToAdmin(memberId) {
  console.log("\n=== Promote Member to Admin ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.members.scopes.update(
      projectId,
      memberId,
      {
        scope: "admin",
      },
    );

    console.log("Updated member scopes:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Update member scopes to member
async function demoteToMember(memberId) {
  console.log("\n=== Demote to Regular Member ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.members.scopes.update(
      projectId,
      memberId,
      {
        scope: "member",
      },
    );

    console.log("Updated member scopes:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: List pending invitations
async function listPendingInvites() {
  console.log("\n=== Pending Invitations ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.members.invites.list(
      projectId,
    );

    console.log("Pending invitations:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Send invitation to new member
async function inviteNewMember() {
  console.log("\n=== Send Member Invitation ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.members.invites.create(
      projectId,
      {
        email: "newmember@example.com",
        scope: "member", // Can be "admin" or "member"
      },
    );

    console.log("Invitation sent:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 7: Delete/revoke an invitation
async function revokeInvitation() {
  console.log("\n=== Revoke Invitation ===\n");

  const inviteEmail = "newmember@example.com";

  try {
    await deepgramClient.manage.v1.projects.members.invites.delete(
      projectId,
      inviteEmail,
    );

    console.log("Invitation revoked successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 8: Remove member from project
async function removeMemberFromProject(memberId) {
  console.log("\n=== Remove Member from Project ===\n");

  try {
    await deepgramClient.manage.v1.projects.members.delete(
      projectId,
      memberId,
    );

    console.log("Member removed successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 9: Audit member permissions
async function auditMemberPermissions() {
  console.log("\n=== Member Permissions Audit ===\n");

  try {
    const members = await deepgramClient.manage.v1.projects.members.list(
      projectId,
    );

    console.log("=== Permission Audit Report ===\n");

    for (const member of members.members || []) {
      try {
        const scopes = await deepgramClient.manage.v1.projects.members.scopes.list(
          projectId,
          member.member_id,
        );

        console.log(`Member: ${member.email || member.member_id}`);
        console.log(`  Role: ${member.scope || "unknown"}`);
        console.log(`  Scopes: ${JSON.stringify(scopes)}`);
        console.log("");
      } catch (error) {
        console.error(`  Error getting scopes: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 10: Manage team permissions workflow
async function manageTeamWorkflow() {
  console.log("\n=== Team Management Workflow ===\n");

  try {
    // Step 1: Check current team composition
    console.log("Step 1: Checking current team...");
    const members = await deepgramClient.manage.v1.projects.members.list(
      projectId,
    );

    const adminCount = members.members?.filter(m => m.scope === "admin").length || 0;
    const memberCount = members.members?.filter(m => m.scope === "member").length || 0;

    console.log(`  Admins: ${adminCount}`);
    console.log(`  Members: ${memberCount}`);
    console.log(`  Total: ${members.members?.length || 0}\n`);

    // Step 2: Check pending invitations
    console.log("Step 2: Checking pending invitations...");
    const invites = await deepgramClient.manage.v1.projects.members.invites.list(
      projectId,
    );

    console.log(`  Pending invitations: ${invites.invites?.length || 0}\n`);

    // Step 3: Review permissions for each member
    console.log("Step 3: Reviewing member permissions...");
    for (const member of members.members || []) {
      const scopes = await deepgramClient.manage.v1.projects.members.scopes.list(
        projectId,
        member.member_id,
      );

      console.log(`  ${member.email || member.member_id}: ${member.scope}`);
    }

    console.log("\nTeam management workflow completed!");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 11: Check if user has specific permissions
async function checkMemberPermission(memberId, requiredScope) {
  console.log("\n=== Check Member Permission ===\n");

  try {
    const scopes = await deepgramClient.manage.v1.projects.members.scopes.list(
      projectId,
      memberId,
    );

    const hasPermission = scopes.scopes?.includes(requiredScope) || false;

    console.log(`Member ${memberId} has '${requiredScope}' permission: ${hasPermission}`);
    console.log(`Current scopes: ${JSON.stringify(scopes.scopes)}`);

    return hasPermission;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// Run examples
(async () => {
  // Get current members
  const members = await listProjectMembers();

  if (members?.members?.[0]?.member_id) {
    const memberId = members.members[0].member_id;

    // Get and display member scopes
    await getMemberScopes(memberId);

    // Examples of scope management (uncomment to test):
    // await promoteToAdmin(memberId);
    // await demoteToMember(memberId);
    // await removeMemberFromProject(memberId);
  }

  // Invitation management
  await listPendingInvites();

  // Examples of invitation management (uncomment to test):
  // await inviteNewMember();
  // await revokeInvitation();

  // Audit and workflow examples
  await auditMemberPermissions();
  await manageTeamWorkflow();

  // Permission checking example (uncomment to test):
  // if (members?.members?.[0]?.member_id) {
  //   await checkMemberPermission(members.members[0].member_id, "admin");
  // }
})();
