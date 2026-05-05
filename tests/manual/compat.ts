/**
 * Manual back-compat smoke test for the SDK regen on 2026-04-30.
 *
 * Proves that `CreateKeyV1RequestOne` (aliased to `CreateKeyV1Request` in
 * src/api/types/CreateKeyV1Request.ts) still works end to end:
 *   1. legacy named import resolves and is bidirectionally assignable with
 *      its canonical name
 *   2. Deepgram.CreateKeyV1RequestOne namespace import resolves
 *   3. real wire round-trip via keys.create + keys.delete using a payload
 *      typed as the legacy alias against the production API
 *
 * This is *not* a usage example. New code should import `CreateKeyV1Request`.
 *
 * Requires DEEPGRAM_API_KEY in the environment for step 3 (and at least one
 * project on the account). Run with:
 *
 *     pnpm tsx tests/manual/compat.ts
 */

import { DeepgramClient, Deepgram } from "../../src";
import type { CreateKeyV1Request, CreateKeyV1RequestOne } from "../../src";

async function main(): Promise<void> {
    console.log("Starting backwards-compatibility manual test");

    console.log("\n[1/3] Type-level identity (flat re-export)");
    {
        const fromCanonical: CreateKeyV1RequestOne = {} as CreateKeyV1Request;
        const fromLegacy: CreateKeyV1Request = {} as CreateKeyV1RequestOne;
        void fromCanonical;
        void fromLegacy;
        console.log("  PASS: CreateKeyV1RequestOne and CreateKeyV1Request are bidirectionally assignable");
    }

    console.log("\n[2/3] Type-level identity (Deepgram namespace re-export)");
    {
        const fromCanonical: Deepgram.CreateKeyV1RequestOne = {} as Deepgram.CreateKeyV1Request;
        const fromLegacy: Deepgram.CreateKeyV1Request = {} as Deepgram.CreateKeyV1RequestOne;
        void fromCanonical;
        void fromLegacy;
        console.log("  PASS: Deepgram.CreateKeyV1RequestOne resolves through the namespace");
    }

    console.log("\n[3/3] Wire round-trip: keys.create + keys.delete via legacy alias");
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
        console.log("  SKIP: DEEPGRAM_API_KEY not set");
        return;
    }

    const client = new DeepgramClient({ apiKey });

    const projects = await client.manage.v1.projects.list();
    if (!projects.projects?.length) {
        console.log("  SKIP: no projects on this account");
        return;
    }
    const projectId = projects.projects[0].project_id;
    console.log(`  Using project: ${projectId}`);

    const request: CreateKeyV1RequestOne = {
        comment: "back-compat smoke test",
        scopes: ["usage:read"],
    };

    const created = await client.manage.v1.projects.keys.create(projectId, request);
    console.log("  PASS: created key via legacy alias");

    await client.manage.v1.projects.keys.delete(projectId, created.api_key_id);
    console.log("  PASS: deleted key");

    console.log("\nBackwards-compatibility smoke test completed.");
}

main().catch((e: unknown) => {
    console.error(`  FAIL: ${(e as Error).message}`);
    process.exitCode = 1;
});
