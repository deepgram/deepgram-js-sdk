/**
 * Example: Project Member Management
 *
 * Examples for managing project members: list, remove, get/update scopes.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// Get all members
async function getMembers() {
  const { result, error } =
    await deepgramClient.manage.getProjectMembers(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Members:", result);
}

// Remove a member
async function removeMember(memberId) {
  const { error } = await deepgramClient.manage.removeProjectMember(
    projectId,
    memberId,
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Member removed successfully");
}

// Get member scopes
async function getMemberScopes(memberId) {
  const { result, error } = await deepgramClient.manage.getProjectMemberScopes(
    projectId,
    memberId,
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Member scopes:", result);
}

// Update member scope
async function updateMemberScope(memberId) {
  const { result, error } =
    await deepgramClient.manage.updateProjectMemberScope(projectId, memberId, {
      // Add scope update options
    });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Updated member scope:", result);
}

// Uncomment to run:
getMembers();
// removeMember("YOUR_MEMBER_ID");
getMemberScopes("YOUR_MEMBER_ID");
updateMemberScope("YOUR_MEMBER_ID");
