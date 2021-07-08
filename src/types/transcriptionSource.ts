export type TranscriptionSource = UrlSource | BufferSource;

export type UrlSource = {
  url: string;
};

export type BufferSource = {
  buffer: Buffer;
  mimetype: string;
};
