export type UsageField = {
  tags: Array<string>;
  models: Array<string>;
  processing_methods: Array<string>;
  languages: Array<string>;
  features: Array<string>;
  err_code?: string;
  err_msg?: string;
};
