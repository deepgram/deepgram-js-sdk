/**
 * Example: Project Invitation Management
 *
 * Examples for managing project invitations: list, send, delete, leave project.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fd061152-cd91-44df-99e5-dd0c9b5de14b";

// List all invites
async function listInvites() {
  try {
    const data = await deepgramClient.manage.v1.projects.members.invites.list(
      projectId,
    );
    console.log("Invites:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Send an invite
async function sendInvite() { 
  try {
    const data = await deepgramClient.manage.v1.projects.members.invites.create(
      projectId,
      {
        email: "user@example.com",
        scope: "member", // Required: scope for the invite
        // Add more invite options as needed
      },
    );
    console.log("Invite sent:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete an invite
async function deleteInvite(email) {
  try {
    await deepgramClient.manage.v1.projects.members.invites.delete(
      projectId,
      email,
    );
    console.log("Invite deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Note: Leave project functionality may not be available in the new SDK
// Check the API documentation for the correct method
async function leaveProject() {
  await deepgramClient.manage.v1.projects.leave(
    projectId,
  );
  console.log("Project left successfully");
  return data;
}

// Uncomment to run:
(async () => {
  await listInvites();
  await sendInvite("noreply@example.com");
  await deleteInvite("noreply@example.com");
  // Accidentally removed myself from my own project. 💀💀💀
  // await leaveProject();
})();
