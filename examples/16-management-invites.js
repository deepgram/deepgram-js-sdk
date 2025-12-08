/**
 * Example: Project Invitation Management
 *
 * Examples for managing project invitations: list, send, delete, leave project.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// List all invites
async function listInvites() {
  const { result, error } =
    await deepgramClient.manage.getProjectInvites(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Invites:", result);
}

// Send an invite
async function sendInvite() {
  const { result, error } = await deepgramClient.manage.sendProjectInvite(
    projectId,
    {
      email: "user@example.com",
      // Add more invite options as needed
    },
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Invite sent:", result);
}

// Delete an invite
async function deleteInvite(email) {
  const { error } = await deepgramClient.manage.deleteProjectInvite(
    projectId,
    email,
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Invite deleted successfully");
}

// Leave a project
async function leaveProject() {
  const { result, error } = await deepgramClient.manage.leaveProject(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Left project:", result);
}

// Uncomment to run:
listInvites();
sendInvite();
deleteInvite("user@example.com");
leaveProject();
