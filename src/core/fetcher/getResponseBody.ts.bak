import { fromJson } from "../json.js";
import { getBinaryResponse } from "./BinaryResponse.js";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Preserve the direct server response while supporting the deprecated wrapper path.
function addLegacyAnalysisFacades(responseBody: unknown): unknown {
    if (!isRecord(responseBody) || !isRecord(responseBody.results)) {
        return responseBody;
    }

    for (const name of ["topics", "intents"] as const) {
        const analysis = responseBody.results[name];
        if (!isRecord(analysis) || !Array.isArray(analysis.segments) || "results" in analysis) {
            continue;
        }

        Object.defineProperty(analysis, "results", {
            value: { [name]: { segments: analysis.segments } },
            enumerable: false,
        });
    }

    return responseBody;
}

// Pins the upstream Response so undici's FinalizationRegistry can't GC it and cancel the body stream.
function retainResponse(target: object, response: Response): void {
    Object.defineProperty(target, "__fern_response_ref", {
        value: response,
        enumerable: false,
        configurable: true,
        writable: false,
    });
}

export type ResponseBodyError = {
    ok: false;
    error: { reason: "non-json"; statusCode: number; rawBody: string } | { reason: "body-is-null"; statusCode: number };
};

const responseBodyErrors = new WeakSet<object>();

function responseBodyError(error: ResponseBodyError["error"]): ResponseBodyError {
    const record: ResponseBodyError = { ok: false, error };
    responseBodyErrors.add(record);
    return record;
}

/**
 * Returns true when `value` is a failure record created by `getResponseBody` (for example malformed JSON),
 * as opposed to a parsed JSON body that happens to have the same shape.
 */
export function isResponseBodyError(value: unknown): value is ResponseBodyError {
    return typeof value === "object" && value != null && responseBodyErrors.has(value);
}

export async function getResponseBody(response: Response, responseType?: string): Promise<unknown> {
    switch (responseType) {
        case "binary-response":
            return getBinaryResponse(response);
        case "blob":
            return await response.blob();
        case "arrayBuffer":
            return await response.arrayBuffer();
        case "sse":
            if (response.body == null) {
                return responseBodyError({
                    reason: "body-is-null",
                    statusCode: response.status,
                });
            }
            retainResponse(response.body, response);
            return response.body;
        case "streaming":
            if (response.body == null) {
                return responseBodyError({
                    reason: "body-is-null",
                    statusCode: response.status,
                });
            }

            retainResponse(response.body, response);
            return response.body;

        case "text":
            return await response.text();
    }

    // if responseType is "json" or not specified, try to parse as JSON
    const text = await response.text();
    if (text.length > 0) {
        try {
            const responseBody = fromJson(text);
            return response.status >= 200 && response.status < 400
                ? addLegacyAnalysisFacades(responseBody)
                : responseBody;
        } catch (_err) {
            return responseBodyError({
                reason: "non-json",
                statusCode: response.status,
                rawBody: text,
            });
        }
    }
    return undefined;
}
