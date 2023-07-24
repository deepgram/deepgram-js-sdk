import crossFetch from "cross-fetch";
import { resolveHeadersConstructor } from "./helpers";
import type { Fetch } from "./types/Fetch";

export const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = crossFetch as unknown as Fetch;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};

export const fetchWithAuth = (deepgramKey: string, customFetch?: Fetch): Fetch => {
  const fetch = resolveFetch(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();

  return async (input, init) => {
    let headers = new HeadersConstructor(init?.headers);

    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Token ${deepgramKey}`);
    }

    return fetch(input, { ...init, headers });
  };
};

export const resolveResponse = async () => {
  if (typeof Response === "undefined") {
    return (await import("cross-fetch")).Response;
  }

  return Response;
};
