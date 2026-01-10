/**
 * Example: Project Management
 *
 * Examples for managing Deepgram projects: list, get, update, delete.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

// Get all projects
async function getProjects() {
  try {
    const data = await deepgramClient.manage.v1.projects.list();
    console.log("Projects:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get a specific project
async function getProject(projectId) {
  try {
    const data = await deepgramClient.manage.v1.projects.get(projectId);
    console.log("Project:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update a project
async function updateProject(projectId) {
  try {
    const data = await deepgramClient.manage.v1.projects.update(
      projectId,
      {
        name: "Naomi's Sandbox",
        // Add more update options as needed
      },
    );
    console.log("Updated project:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete a project
async function deleteProject(projectId) {
  try {
    await deepgramClient.manage.v1.projects.delete(projectId);
    console.log("Project deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
(async () => {
  const projects = await getProjects();
  getProject(projects.projects[0].project_id);
  updateProject(projects.projects[0].project_id);
  // Not testing this one, it's destructive.
  // deleteProject(projects[0].id);
})();
