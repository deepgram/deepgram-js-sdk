export type UsageRequestDetail = {
  details: {
    usd: number;
    duration: number;
    total_audio: number;
    channels: number;
    streams: number;
    model: string;
    method: string;
    tags: Array<string>;
    features: Array<string>;
    config: {
      diarize: true;
      multichannel: true;
    };
  };
};
