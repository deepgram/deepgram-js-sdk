type Model = {
  name: string;
  canonical_name: string;
  architecture: string;
  languages?: string[];
  language?: string;
  version: string;
  uuid: string;
  batch?: boolean;
  streaming?: boolean;
  formatted_output?: boolean;
  metadata?: {
    accent: string;
    color: string;
    gender: string;
    image: string;
    sample: string;
  };
};

export type GetModelResponse = Model;

export type GetModelsResponse = {
  stt: Model[];
  tts: Model[];
};
