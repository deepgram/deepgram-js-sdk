export function validateOptions(apiKey: string, apiUrl: string): void {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("DG: API key is required");
  }

  if (!apiUrl || apiUrl.trim().length === 0) {
    throw new Error("DG: API url should be a valid url or not provided");
  }
}
