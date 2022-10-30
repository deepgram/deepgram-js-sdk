import { Paragraph } from "./paragraph";

export type ParagraphGroup = {
  /**
   * Full transcript
   */
  transcript: string;
  /**
   * Array of Paragraph objects.
   */
  paragraphs: Array<Paragraph>;
};
