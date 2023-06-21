export type Metadata = {
  request_id: string;
  transaction_key: string;
  sha256: string;
  created: string;
  duration: number;
  channels: number;
  model_info: {
    [key: string]: {
      name: string;
      version: string;
      arch: string;
    };
  };
  models: Array<string>;
};
