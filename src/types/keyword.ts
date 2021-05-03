export type Keyword =
  | string
  | {
      word: string;
      boost: number;
    };
