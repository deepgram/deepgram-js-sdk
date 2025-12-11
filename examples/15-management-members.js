/**
 * Example: Project Member Management
 *
 * Examples for managing project members: list, remove, get/update scopes.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fdf4337c-a05a-4f3c-b157-fd560c58d802";

// Get all members
async function getMembers() {
  try {
    const data = await deepgramClient.manage.v1.projects.members.list(
      projectId,  
    );
    console.log("Members:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Remove a member
async function removeMember(memberId) {
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

// Get member scopes
async function getMemberScopes(memberId) {
  try {
    const data = await deepgramClient.manage.v1.projects.members.scopes.list(
      projectId,
      memberId,
    );
    console.log("Member scopes:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update member scope
async function updateMemberScope(memberId) {
  try {
    const data = await deepgramClient.manage.v1.projects.members.scopes.update(
      projectId,
      memberId,
      {
        scope: "admin", // Add scope update options
      },
    );
    console.log("Updated member scope:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
(async () => {
  const members = await getMembers();
  // Not testing this one, it's destructive.
// removeMember("YOUR_MEMBER_ID");
  await getMemberScopes(members.members[0].member_id);
  await updateMemberScope(members.members[0].member_id);
})();
