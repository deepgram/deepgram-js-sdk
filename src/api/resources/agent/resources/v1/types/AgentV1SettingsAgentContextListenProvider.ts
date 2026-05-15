// Backward-compat: the 2026-05-14 regen consolidated the listen-provider sub-types
// into top-level `DeepgramListenProviderV1` / `DeepgramListenProviderV2` and dropped
// the nested `AgentV1SettingsAgentContextListenProviderV2.LanguageHint` namespace
// path. We restore the nested namespace as an alias to `DeepgramListenProviderV2.LanguageHint`
// so existing imports of the deep path still resolve. Mirrors the Python SDK's
// `AgentV1SettingsAgentContextListenProviderV2LanguageHint` compat shim added in
// deepgram-python-sdk#714. Regression coverage in tests/unit/compat-aliases.test.ts.

import type * as Deepgram from "../../../../../index.js";

export type AgentV1SettingsAgentContextListenProvider =
    | Deepgram.agent.AgentV1SettingsAgentContextListenProvider.V1
    | Deepgram.agent.AgentV1SettingsAgentContextListenProvider.V2;

export namespace AgentV1SettingsAgentContextListenProvider {
    export interface V1 extends Deepgram.DeepgramListenProviderV1 {
        version: "v1";
    }

    export interface V2 extends Deepgram.DeepgramListenProviderV2 {
        version: "v2";
    }

    export namespace AgentV1SettingsAgentContextListenProviderV2 {
        export type LanguageHint = Deepgram.DeepgramListenProviderV2.LanguageHint;
    }
}
