/**
 * useDeepgramAgent — React hook for the Deepgram Voice Agent API.
 *
 * Wraps the agent v1 WebSocket with declarative React state so that
 * components don't need to manage WebSocket lifecycle, audio capture,
 * or event handling manually.
 *
 * Usage:
 * ```tsx
 * import { useDeepgramAgent } from "@deepgram/sdk/react";
 *
 * function VoiceAgent() {
 *   const { connect, disconnect, isConnected, transcript, agentText, error, sendFunctionResult } =
 *     useDeepgramAgent({
 *       apiKey: process.env.DEEPGRAM_API_KEY,
 *       agent: {
 *         think: { provider: { type: "open_ai" }, model: "gpt-4o-mini" },
 *         speak: { model: "aura-asteria-en" },
 *       },
 *       onFunctionCall: async (name, params) => ({ result: "done" }),
 *     });
 *
 *   return (
 *     <button onClick={isConnected ? disconnect : connect}>
 *       {isConnected ? "End" : "Start"} Conversation
 *     </button>
 *   );
 * }
 * ```
 *
 * @module
 */

// NOTE: This module depends on React. React is a peer dependency — ensure
// `react` ≥ 16.8 is installed in the consuming project.
import { useCallback, useEffect, useRef, useState } from "react";
import { DeepgramClient } from "../Client.js";
import type * as Deepgram from "../api/index.js";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface UseDeepgramAgentOptions {
    /**
     * Deepgram API key used to authenticate the WebSocket connection.
     *
     * Keep this key server-side in production. For client-side use, generate
     * a short-lived token via the Deepgram Auth API and pass it here.
     */
    apiKey: string;

    /**
     * Voice agent configuration forwarded to the Deepgram settings message
     * immediately after the WebSocket opens.
     */
    agent: Deepgram.agent.v1.AgentV1SettingsAgent;

    /**
     * Called when the agent requests a function/tool call. Return the result
     * object to forward back to the agent. Throwing will be caught and the
     * error message sent as the result.
     */
    onFunctionCall?: (
        name: string,
        params: Record<string, unknown>
    ) => Promise<unknown> | unknown;

    /**
     * Called when a new user transcript segment arrives. `isFinal` is true
     * once the segment is complete.
     */
    onTranscript?: (text: string, isFinal: boolean) => void;

    /**
     * Called when the agent produces a text response chunk.
     */
    onAgentResponse?: (text: string) => void;

    /**
     * Base URL override (useful for testing or on-prem deployments).
     */
    baseUrl?: string;
}

export interface UseDeepgramAgentResult {
    /** Open the WebSocket and start the voice session. */
    connect: () => void;
    /** Close the WebSocket and stop the voice session. */
    disconnect: () => void;
    /** Whether the WebSocket is currently open and ready. */
    isConnected: boolean;
    /** Whether the user is currently speaking (microphone active). */
    isListening: boolean;
    /** Whether the agent is currently speaking (audio playing). */
    isSpeaking: boolean;
    /** Most recent user transcript text. */
    transcript: string;
    /** Most recent agent response text. */
    agentText: string;
    /** Error from the last failed operation, if any. */
    error: Error | null;
    /**
     * Manually send a function call result back to the agent.
     * Normally you would use `onFunctionCall` instead; this escape hatch
     * is for cases where you need to send the result from outside the callback.
     */
    sendFunctionResult: (functionCallId: string, result: unknown) => void;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useDeepgramAgent(options: UseDeepgramAgentOptions): UseDeepgramAgentResult {
    const {
        apiKey,
        agent,
        onFunctionCall,
        onTranscript,
        onAgentResponse,
        baseUrl,
    } = options;

    // ---- state ----
    const [isConnected, setIsConnected] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [agentText, setAgentText] = useState("");
    const [error, setError] = useState<Error | null>(null);

    // ---- stable refs so callbacks always see current values ----
    const socketRef = useRef<Awaited<ReturnType<InstanceType<typeof DeepgramClient>["agent"]["v1"]["connect"]>> | null>(null);
    const onFunctionCallRef = useRef(onFunctionCall);
    const onTranscriptRef = useRef(onTranscript);
    const onAgentResponseRef = useRef(onAgentResponse);

    // Keep callback refs current without re-running effects
    useEffect(() => { onFunctionCallRef.current = onFunctionCall; }, [onFunctionCall]);
    useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
    useEffect(() => { onAgentResponseRef.current = onAgentResponse; }, [onAgentResponse]);

    // ---- connect ----
    const connect = useCallback(async () => {
        setError(null);
        try {
            const client = new DeepgramClient({ apiKey, ...(baseUrl ? { environment: { agent: baseUrl } as unknown as string } : {}) });
            const socket = await client.agent.v1.connect({ Authorization: `Token ${apiKey}` });

            socket.on("open", () => {
                // Send initial settings as soon as the connection is established
                socket.sendSettings({ type: "Settings", audio: { input: { encoding: "linear16", sample_rate: 16000 }, output: { encoding: "linear16", sample_rate: 24000, bitrate: 128000, container: "none" } }, agent });
                setIsConnected(true);
            });

            socket.on("message", async (msg) => {
                if (typeof msg === "string") return;

                const m = msg as Deepgram.agent.V1Socket.Response;

                if (isAgentV1ConversationText(m)) {
                    const text = m.content ?? "";
                    if (m.role === "user") {
                        setTranscript(text);
                        onTranscriptRef.current?.(text, true);
                    } else if (m.role === "assistant") {
                        setAgentText(text);
                        onAgentResponseRef.current?.(text);
                    }
                } else if (isAgentV1UserStartedSpeaking(m)) {
                    setIsListening(true);
                } else if (isAgentV1AgentStartedSpeaking(m)) {
                    setIsSpeaking(true);
                    setIsListening(false);
                } else if (isAgentV1AgentAudioDone(m)) {
                    setIsSpeaking(false);
                } else if (isAgentV1FunctionCallRequest(m)) {
                    const req = m as Deepgram.agent.AgentV1FunctionCallRequest;
                    const fnName = req.function_name ?? "";
                    const fnParams = req.input as Record<string, unknown> ?? {};
                    let result: unknown = null;
                    try {
                        result = await onFunctionCallRef.current?.(fnName, fnParams) ?? null;
                    } catch (err) {
                        result = { error: err instanceof Error ? err.message : String(err) };
                    }
                    socket.sendFunctionCallResponse({
                        type: "FunctionCallResponse",
                        function_call_id: req.function_call_id ?? "",
                        output: JSON.stringify(result),
                    });
                } else if (isAgentV1Error(m)) {
                    setError(new Error((m as Deepgram.agent.AgentV1Error).description ?? "Agent error"));
                }
            });

            socket.on("close", () => {
                setIsConnected(false);
                setIsListening(false);
                setIsSpeaking(false);
            });

            socket.on("error", (err) => {
                setError(err);
                setIsConnected(false);
            });

            socket.connect();
            socketRef.current = socket;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [apiKey, agent, baseUrl]);

    // ---- disconnect ----
    const disconnect = useCallback(() => {
        socketRef.current?.socket?.close();
        socketRef.current = null;
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
    }, []);

    // ---- sendFunctionResult escape hatch ----
    const sendFunctionResult = useCallback((functionCallId: string, result: unknown) => {
        socketRef.current?.sendFunctionCallResponse({
            type: "FunctionCallResponse",
            function_call_id: functionCallId,
            output: JSON.stringify(result),
        });
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => { socketRef.current?.socket?.close(); };
    }, []);

    return { connect, disconnect, isConnected, isListening, isSpeaking, transcript, agentText, error, sendFunctionResult };
}

// ---------------------------------------------------------------------------
// Narrow type guards for discriminated union messages
// ---------------------------------------------------------------------------

function isAgentV1ConversationText(m: unknown): m is Deepgram.agent.AgentV1ConversationText {
    return typeof m === "object" && m !== null && (m as Record<string, unknown>).type === "ConversationText";
}

function isAgentV1UserStartedSpeaking(m: unknown): m is Deepgram.agent.AgentV1UserStartedSpeaking {
    return typeof m === "object" && m !== null && (m as Record<string, unknown>).type === "UserStartedSpeaking";
}

function isAgentV1AgentStartedSpeaking(m: unknown): m is Deepgram.agent.AgentV1AgentStartedSpeaking {
    return typeof m === "object" && m !== null && (m as Record<string, unknown>).type === "AgentStartedSpeaking";
}

function isAgentV1AgentAudioDone(m: unknown): m is Deepgram.agent.AgentV1AgentAudioDone {
    return typeof m === "object" && m !== null && (m as Record<string, unknown>).type === "AgentAudioDone";
}

function isAgentV1FunctionCallRequest(m: unknown): m is Deepgram.agent.AgentV1FunctionCallRequest {
    return typeof m === "object" && m !== null && (m as Record<string, unknown>).type === "FunctionCallRequest";
}

function isAgentV1Error(m: unknown): m is Deepgram.agent.AgentV1Error {
    return typeof m === "object" && m !== null && (m as Record<string, unknown>).type === "Error";
}
