/**
 * Options for read analysis
 */
interface AnalyzeSchema extends Record<string, unknown> {
  callback?: string;

  callback_method?: string;

  custom_intent?: string | string[];

  custom_intent_mode?: "strict" | "extended";

  custom_topic?: string | string[];

  custom_topic_mode?: "strict" | "extended";

  intents?: boolean;

  language?: string;

  summarize?: boolean;

  sentiment?: boolean;

  topics?: boolean;
}

export type { AnalyzeSchema };
