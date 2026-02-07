/**
 * Example: Project Models Management
 *
 * Demonstrates project-specific model access and information including:
 * - Listing models available to a project
 * - Getting detailed model metadata
 * - Including/excluding outdated models
 * - Comparing global vs project-specific models
 * - Finding models by capability
 */

const { DeepgramClient } = require("../dist/cjs/index.js");

const deepgramClient = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

const projectId = process.env.DEEPGRAM_PROJECT_ID;

// Example 1: List all models available to the project
async function listProjectModels() {
  console.log("\n=== Project Models (Latest Only) ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false, // Only latest versions
      },
    );

    console.log("Available models:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: List all models including outdated versions
async function listAllModelsIncludingOutdated() {
  console.log("\n=== All Project Models (Including Outdated) ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: true, // Include all versions
      },
    );

    console.log("All available models:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Get specific model details
async function getModelDetails(modelId) {
  console.log("\n=== Specific Model Details ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.get(
      projectId,
      modelId,
    );

    console.log(`Model ${modelId} details:`);
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 4: Compare global models vs project models
async function compareGlobalAndProjectModels() {
  console.log("\n=== Global vs Project Models Comparison ===\n");

  try {
    // Get global models
    const globalModels = await deepgramClient.manage.v1.models.list({
      include_outdated: false,
    });

    // Get project-specific models
    const projectModels = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false,
      },
    );

    console.log("Global models count:", globalModels.stt?.length || 0);
    console.log("Project models count:", projectModels.stt?.length || 0);

    // Find models available to project but not in global list (custom/private models)
    const globalModelIds = new Set(globalModels.stt?.map(m => m.uuid) || []);
    const customModels = projectModels.stt?.filter(m => !globalModelIds.has(m.uuid)) || [];

    console.log("\nCustom/Private models for this project:", customModels.length);
    if (customModels.length > 0) {
      console.log("Custom models:");
      console.log(JSON.stringify(customModels, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Find models by capability/language
async function findModelsByCapability() {
  console.log("\n=== Models by Language ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false,
      },
    );

    // Group models by language
    const byLanguage = {};

    for (const model of data.stt || []) {
      const language = model.language || "unknown";
      if (!byLanguage[language]) {
        byLanguage[language] = [];
      }
      byLanguage[language].push({
        name: model.name,
        uuid: model.uuid,
        version: model.version,
      });
    }

    console.log("Models grouped by language:");
    for (const [language, models] of Object.entries(byLanguage)) {
      console.log(`\n${language.toUpperCase()}:`);
      for (const model of models) {
        console.log(`  - ${model.name} (${model.version})`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Find newest models
async function findNewestModels() {
  console.log("\n=== Newest Models ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false,
      },
    );

    // Sort by version (assuming higher version = newer)
    const sortedModels = (data.stt || [])
      .map(m => ({
        name: m.name,
        version: m.version,
        uuid: m.uuid,
        language: m.language,
      }))
      .sort((a, b) => (b.version || "").localeCompare(a.version || ""));

    console.log("Models sorted by version (newest first):");
    sortedModels.slice(0, 5).forEach((model, index) => {
      console.log(`${index + 1}. ${model.name} (${model.version}) - ${model.language}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 7: Check model availability for specific feature
async function checkModelAvailability() {
  console.log("\n=== Model Feature Availability ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false,
      },
    );

    console.log("Total available models:", data.stt?.length || 0);

    // Count models by architecture (if available in metadata)
    const modelSummary = {
      total: data.stt?.length || 0,
      languages: new Set(data.stt?.map(m => m.language).filter(Boolean)).size,
    };

    console.log("\nModel Summary:");
    console.log(`  Total models: ${modelSummary.total}`);
    console.log(`  Languages supported: ${modelSummary.languages}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 8: Find model by name
async function findModelByName(modelName) {
  console.log(`\n=== Find Model: ${modelName} ===\n`);

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: true, // Include all to find older versions
      },
    );

    const matchingModels = data.stt?.filter(m =>
      m.name?.toLowerCase().includes(modelName.toLowerCase()),
    ) || [];

    if (matchingModels.length > 0) {
      console.log(`Found ${matchingModels.length} matching model(s):`);
      for (const model of matchingModels) {
        console.log(`\nModel: ${model.name} (${model.version})`);
        console.log(`  UUID: ${model.uuid}`);
        console.log(`  Language: ${model.language}`);

        // Get detailed info for this model
        try {
          const details = await deepgramClient.manage.v1.projects.models.get(
            projectId,
            model.uuid,
          );
          console.log(`  Details: ${JSON.stringify(details, null, 2)}`);
        } catch (err) {
          console.log(`  Could not fetch details: ${err.message}`);
        }
      }
    } else {
      console.log("No matching models found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 9: Model version tracking
async function trackModelVersions() {
  console.log("\n=== Model Version Tracking ===\n");

  try {
    const allModels = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: true,
      },
    );

    const latestModels = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false,
      },
    );

    // Group by base model name
    const versionMap = {};

    for (const model of allModels.stt || []) {
      const baseName = model.name?.replace(/-\d+$/, "") || model.name;
      if (!versionMap[baseName]) {
        versionMap[baseName] = [];
      }
      versionMap[baseName].push({
        name: model.name,
        version: model.version,
        uuid: model.uuid,
        isLatest: latestModels.stt?.some(m => m.uuid === model.uuid),
      });
    }

    console.log("Model families with versions:");
    for (const [baseName, versions] of Object.entries(versionMap)) {
      console.log(`\n${baseName}:`);
      for (const version of versions) {
        const latest = version.isLatest ? " [LATEST]" : "";
        console.log(`  - ${version.name} (${version.version})${latest}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 10: Export model inventory
async function exportModelInventory() {
  console.log("\n=== Model Inventory Export ===\n");

  try {
    const data = await deepgramClient.manage.v1.projects.models.list(
      projectId,
      {
        include_outdated: false,
      },
    );

    const inventory = {
      project_id: projectId,
      exported_at: new Date().toISOString(),
      total_models: data.stt?.length || 0,
      models: data.stt?.map(m => ({
        name: m.name,
        version: m.version,
        uuid: m.uuid,
        language: m.language,
      })) || [],
    };

    console.log("Model Inventory:");
    console.log(JSON.stringify(inventory, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run all examples
(async () => {
  const models = await listProjectModels();
  await listAllModelsIncludingOutdated();

  if (models?.stt?.[0]?.uuid) {
    await getModelDetails(models.stt[0].uuid);
  }

  await compareGlobalAndProjectModels();
  await findModelsByCapability();
  await findNewestModels();
  await checkModelAvailability();
  await trackModelVersions();
  await exportModelInventory();

  // Example of finding specific model (uncomment to test):
  // await findModelByName("nova");
})();
