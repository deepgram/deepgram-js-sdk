/**
 * Example: Model Management
 *
 * Examples for retrieving available models.
 */

const { createClient } = require("@deepgram/sdk");

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const projectId = "YOUR_PROJECT_ID";

// Get all models (globally available)
async function getAllModels() {
  const { result, error } = await deepgramClient.models.getAll();

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("All models:", result);
}

// Get all project models
async function getProjectModels() {
  const { result, error } = await deepgramClient.manage.getAllModels(
    projectId,
    {},
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Project models:", result);
}

// Get a specific model
async function getModel(modelId) {
  const { result, error } = await deepgramClient.manage.getModel(
    projectId,
    modelId,
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Model:", result);
}

// Uncomment to run:
getAllModels();
getProjectModels();
getModel("YOUR_MODEL_ID");
