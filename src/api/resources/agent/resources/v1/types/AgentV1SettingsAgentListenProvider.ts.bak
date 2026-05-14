// Backward-compat alias for the type renamed by the 2026-05-06 regen to
// `AgentV1SettingsAgentContextListenProvider`. The new V2 only adds an optional
// `language_hint` field, so this alias is purely additive: every literal that
// satisfied the old V2 still satisfies the new V2, and pinned-name callers
// (`const p: AgentV1SettingsAgentListenProvider = ...`) keep compiling without
// a cast. See AGENTS.md for the patch rationale; regression coverage in
// tests/unit/compat-aliases.test.ts.

import type * as Deepgram from "../../../../../index.js";

export type AgentV1SettingsAgentListenProvider = Deepgram.agent.AgentV1SettingsAgentContextListenProvider;

export namespace AgentV1SettingsAgentListenProvider {
    export type V1 = Deepgram.agent.AgentV1SettingsAgentContextListenProvider.V1;
    export type V2 = Deepgram.agent.AgentV1SettingsAgentContextListenProvider.V2;
}
