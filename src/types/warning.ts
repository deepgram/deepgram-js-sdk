export type Warning = {
  parameter: string;
  type:
    | "unsupported_language"
    | "unsupported_model"
    | "unsupported_encoding"
    | "deprecated";
  message: string;
};
