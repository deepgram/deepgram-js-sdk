/**
 * Example: Model Management
 *
 * Examples for retrieving available models.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = "fd061152-cd91-44df-99e5-dd0c9b5de14b";

// Get all models (globally available)
async function getAllModels() {
  try {
    const data = await deepgramClient.manage.v1.models.list();
    console.log("All models:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get all project models
async function getProjectModels() {
  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {},
    );
    console.log("Project models:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Get a specific model
async function getModel(modelId) {
  try {
    const data = await deepgramClient.manage.v1.projects.models.get(
      projectId,
      modelId,
    );
    console.log("Model:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// WORKS!
(async () => {
  const models = await getAllModels();
  await getProjectModels();
  await getModel(models.tts[0].uuid);
})();
