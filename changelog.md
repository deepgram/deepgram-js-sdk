## 6.0.0 - 2026-03-18
* The Agent configuration type has been restructured as a union type that accepts either a detailed configuration object or a simple agent ID string for use with the agent builder. This change simplifies agent setup when using pre-built agents but requires updating existing code that accesses nested Agent properties. The AgentV1SettingsAgentListenProvider type has been renamed to AgentV1SettingsAgentContextListenProvider. Project members API now includes additional fields: scopes, first_name, and last_name.

