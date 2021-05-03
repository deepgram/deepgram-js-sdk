import { Hit } from "./hit";
import { WordBase } from "./wordBase";

export type Channel = {
  search: Array<{ query: string; hits: Array<Hit> }>;
  alternatives: Array<{
    transcript: string;
    confidence: number;
    words: Array<WordBase>;
  }>;
};
