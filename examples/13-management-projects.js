/**
 * Example: Project Management
 * 
 * Examples for managing Deepgram projects: list, get, update, delete.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

// Get all projects
async function getProjects() {
  const { result, error } = await deepgramClient.manage.getProjects();

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Projects:", result);
}

// Get a specific project
async function getProject(projectId) {
  const { result, error } = await deepgramClient.manage.getProject(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Project:", result);
}

// Update a project
async function updateProject(projectId) {
  const { result, error } = await deepgramClient.manage.updateProject(projectId, {
    name: "Updated Project Name",
    // Add more update options as needed
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Updated project:", result);
}

// Delete a project
async function deleteProject(projectId) {
  const { error } = await deepgramClient.manage.deleteProject(projectId);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Project deleted successfully");
}

// Uncomment to run:
getProjects();
getProject("YOUR_PROJECT_ID");
updateProject("YOUR_PROJECT_ID");
deleteProject("YOUR_PROJECT_ID");

