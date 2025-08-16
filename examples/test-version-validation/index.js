/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-console */

const { createClient } = require("../../dist/main/index");
require("dotenv").config();

const testVersionValidation = () => {
  console.log("🧪 Testing Version Validation");
  console.log("=".repeat(50));

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // Test 1: v1 should work for all APIs
  console.log("\n1️⃣ Testing v1 (should work for all APIs)...");
  try {
    const v1Client = deepgram.v("v1");
    console.log("   ✅ v1 client created");

    // Test all API endpoints with v1
    console.log("   📡 Testing v1 APIs:");
    console.log("     • auth:", typeof v1Client.auth === "object" ? "✅" : "❌");
    console.log("     • listen:", typeof v1Client.listen === "object" ? "✅" : "❌");
    console.log("     • manage:", typeof v1Client.manage === "object" ? "✅" : "❌");
    console.log("     • models:", typeof v1Client.models === "object" ? "✅" : "❌");
    console.log("     • read:", typeof v1Client.read === "object" ? "✅" : "❌");
    console.log("     • speak:", typeof v1Client.speak === "object" ? "✅" : "❌");
    console.log("     • selfhosted:", typeof v1Client.selfhosted === "object" ? "✅" : "❌");
    console.log("     • agent:", typeof v1Client.agent === "function" ? "✅" : "❌");
  } catch (error) {
    console.log("   ❌ v1 failed:", error.message);
  }

  // Test 2: v2 should work for listen only
  console.log("\n2️⃣ Testing v2 listen (should work)...");
  try {
    const v2Client = deepgram.v("v2");
    console.log("   ✅ v2 client created");

    // This should work - listen supports v2
    const listenClient = v2Client.listen;
    console.log("   ✅ v2 listen client:", typeof listenClient === "object" ? "works" : "failed");
  } catch (error) {
    console.log("   ❌ v2 listen failed:", error.message);
  }

  // Test 3: v2 should fail for other APIs
  console.log("\n3️⃣ Testing v2 on unsupported APIs (should fail)...");
  const v2Client = deepgram.v("v2");

  const apisToTest = [
    { name: "auth", getter: () => v2Client.auth },
    { name: "manage", getter: () => v2Client.manage },
    { name: "models", getter: () => v2Client.models },
    { name: "read", getter: () => v2Client.read },
    { name: "speak", getter: () => v2Client.speak },
    { name: "selfhosted", getter: () => v2Client.selfhosted },
    { name: "agent", getter: () => v2Client.agent() },
  ];

  apisToTest.forEach(({ name, getter }) => {
    try {
      getter();
      console.log(`   ❌ ${name}: Should have failed but didn't`);
    } catch (error) {
      if (error.message.includes("not supported")) {
        console.log(`   ✅ ${name}: Correctly blocked (${error.message.split(".")[0]})`);
      } else {
        console.log(`   ⚠️ ${name}: Failed with unexpected error: ${error.message}`);
      }
    }
  });

  // Test 4: Invalid version should fail
  console.log("\n4️⃣ Testing invalid version (should fail)...");
  try {
    const invalidClient = deepgram.v("v3");
    const listenClient = invalidClient.listen; // Try to access any API
    console.log("   ❌ v3 should have failed but didn't");
  } catch (error) {
    if (error.message.includes("not supported")) {
      console.log("   ✅ v3 correctly blocked:", error.message.split(".")[0]);
    } else {
      console.log("   ⚠️ v3 failed with unexpected error:", error.message);
    }
  }

  console.log("\n🎯 Version Validation Summary:");
  console.log("   • v1: Supported for all APIs");
  console.log("   • v2: Only supported for listen API");
  console.log("   • v3+: Not supported for any API");
  console.log("   • Validation happens at core level when accessing APIs");
};

console.log("🚀 Deepgram Version Validation Test");
console.log("This test verifies that:");
console.log("• v1 works for all APIs");
console.log("• v2 only works for listen API");
console.log("• Invalid versions are rejected");
console.log("• Validation happens at the core level");

testVersionValidation();
