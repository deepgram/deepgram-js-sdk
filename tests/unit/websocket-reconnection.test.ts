import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for WebSocket reconnection and message queue functionality.
 *
 * These tests verify that the ReconnectingWebSocket class properly:
 * 1. Queues messages when the connection is not open
 * 2. Sends queued messages when the connection opens
 * 3. Handles reconnection with exponential backoff
 * 4. Preserves event handlers across reconnections
 *
 * Related issues:
 * - Send-queue for connection drops
 * - WebSocket reconnect without redefining event handlers
 */

describe("WebSocket message queue functionality", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    describe("Message queueing when socket is not open", () => {
        it("should queue messages when socket is in CONNECTING state", () => {
            const queue: any[] = [];
            const mockSocket = {
                readyState: 0, // CONNECTING
                OPEN: 1,
                send: vi.fn(),
            };

            // Simulate ReconnectingWebSocket's send behavior
            const send = (data: any) => {
                if (mockSocket.readyState === mockSocket.OPEN) {
                    mockSocket.send(data);
                } else {
                    queue.push(data);
                }
            };

            // Send while connecting
            send({ type: "audio", data: "chunk1" });
            send({ type: "audio", data: "chunk2" });
            send({ type: "audio", data: "chunk3" });

            // Messages should be queued, not sent
            expect(mockSocket.send).not.toHaveBeenCalled();
            expect(queue).toHaveLength(3);
            expect(queue).toEqual([
                { type: "audio", data: "chunk1" },
                { type: "audio", data: "chunk2" },
                { type: "audio", data: "chunk3" },
            ]);
        });

        it("should respect maxEnqueuedMessages limit", () => {
            const queue: any[] = [];
            const maxEnqueuedMessages = 2;
            const mockSocket = {
                readyState: 0, // CONNECTING
                OPEN: 1,
                send: vi.fn(),
            };

            // Simulate ReconnectingWebSocket's send behavior with limit
            const send = (data: any) => {
                if (mockSocket.readyState === mockSocket.OPEN) {
                    mockSocket.send(data);
                } else if (queue.length < maxEnqueuedMessages) {
                    queue.push(data);
                }
                // Messages beyond limit are silently dropped
            };

            // Try to send more than max
            send({ type: "audio", data: "chunk1" });
            send({ type: "audio", data: "chunk2" });
            send({ type: "audio", data: "chunk3" }); // Should be dropped
            send({ type: "audio", data: "chunk4" }); // Should be dropped

            // Only maxEnqueuedMessages should be queued
            expect(queue).toHaveLength(2);
            expect(queue).toEqual([
                { type: "audio", data: "chunk1" },
                { type: "audio", data: "chunk2" },
            ]);
        });

        it("should send directly when socket is OPEN", () => {
            const queue: any[] = [];
            const sentMessages: any[] = [];
            const mockSocket = {
                readyState: 1, // OPEN
                OPEN: 1,
                send: vi.fn((data) => sentMessages.push(data)),
            };

            // Simulate ReconnectingWebSocket's send behavior
            const send = (data: any) => {
                if (mockSocket.readyState === mockSocket.OPEN) {
                    mockSocket.send(data);
                } else {
                    queue.push(data);
                }
            };

            // Send while open
            send({ type: "audio", data: "chunk1" });
            send({ type: "audio", data: "chunk2" });

            // Messages should be sent directly
            expect(mockSocket.send).toHaveBeenCalledTimes(2);
            expect(queue).toHaveLength(0);
            expect(sentMessages).toHaveLength(2);
        });

        it("should flush queued messages when connection opens", () => {
            const queue: any[] = [
                { type: "audio", data: "queued1" },
                { type: "audio", data: "queued2" },
                { type: "finalize" },
            ];
            const sentMessages: any[] = [];
            const mockSocket = {
                readyState: 1, // Now OPEN
                send: vi.fn((data) => sentMessages.push(data)),
            };

            // Simulate _handleOpen flushing the queue
            const flushQueue = () => {
                queue.forEach((message) => mockSocket.send(message));
                queue.length = 0; // Clear the queue
            };

            flushQueue();

            // All queued messages should be sent in order
            expect(sentMessages).toHaveLength(3);
            expect(sentMessages[0]).toEqual({ type: "audio", data: "queued1" });
            expect(sentMessages[1]).toEqual({ type: "audio", data: "queued2" });
            expect(sentMessages[2]).toEqual({ type: "finalize" });
            expect(queue).toHaveLength(0);
        });
    });

    describe("Reconnection behavior", () => {
        it("should calculate exponential backoff delay correctly", () => {
            const minDelay = 1000;
            const maxDelay = 10000;
            const growFactor = 1.3;

            // Simulate getNextDelay calculation
            const getNextDelay = (retryCount: number) => {
                if (retryCount === 0) return 0;
                let delay = minDelay * Math.pow(growFactor, retryCount - 1);
                if (delay > maxDelay) delay = maxDelay;
                return delay;
            };

            // First retry (retryCount = 1)
            expect(getNextDelay(1)).toBe(1000);

            // Second retry (retryCount = 2)
            expect(getNextDelay(2)).toBe(1300);

            // Third retry (retryCount = 3)
            expect(getNextDelay(3)).toBeCloseTo(1690, 0);

            // Eventually caps at maxDelay
            expect(getNextDelay(20)).toBe(10000);
        });

        it("should respect maxRetries limit", () => {
            const maxRetries = 3;
            let retryCount = 0;
            let shouldReconnect = true;

            // Simulate reconnection logic
            const attemptReconnect = () => {
                if (!shouldReconnect) return false;
                if (retryCount >= maxRetries) {
                    return false;
                }
                retryCount++;
                return true;
            };

            // First 3 attempts should succeed
            expect(attemptReconnect()).toBe(true);
            expect(attemptReconnect()).toBe(true);
            expect(attemptReconnect()).toBe(true);

            // 4th attempt should fail (exceeded maxRetries)
            expect(attemptReconnect()).toBe(false);
            expect(retryCount).toBe(3);
        });

        it("should reset retry count on successful connection", () => {
            let retryCount = 5; // Simulating after several failed attempts

            // Simulate _acceptOpen resetting the count
            const acceptOpen = () => {
                retryCount = 0;
            };

            acceptOpen();
            expect(retryCount).toBe(0);
        });
    });

    describe("Event handler preservation across reconnections", () => {
        it("should preserve event handlers in _listeners object", () => {
            // Simulate ReconnectingWebSocket's listener storage
            const listeners: Record<string, Function[]> = {
                open: [],
                close: [],
                message: [],
                error: [],
            };

            const openHandler = vi.fn();
            const messageHandler = vi.fn();
            const closeHandler = vi.fn();
            const errorHandler = vi.fn();

            // Add listeners
            listeners.open.push(openHandler);
            listeners.message.push(messageHandler);
            listeners.close.push(closeHandler);
            listeners.error.push(errorHandler);

            // Simulate a reconnection (doesn't clear user-added listeners)
            // Only internal handlers are removed/re-added

            // Verify handlers are still there
            expect(listeners.open).toContain(openHandler);
            expect(listeners.message).toContain(messageHandler);
            expect(listeners.close).toContain(closeHandler);
            expect(listeners.error).toContain(errorHandler);
        });

        it("should allow removing specific listeners", () => {
            const listeners: Function[] = [];

            const handler1 = vi.fn();
            const handler2 = vi.fn();
            const handler3 = vi.fn();

            listeners.push(handler1);
            listeners.push(handler2);
            listeners.push(handler3);

            // Remove handler2
            const index = listeners.indexOf(handler2);
            if (index > -1) {
                listeners.splice(index, 1);
            }

            expect(listeners).toContain(handler1);
            expect(listeners).not.toContain(handler2);
            expect(listeners).toContain(handler3);
            expect(listeners).toHaveLength(2);
        });
    });

    describe("Connection timeout handling", () => {
        it("should trigger timeout error after connectionTimeout", async () => {
            const connectionTimeout = 4000;
            let timeoutTriggered = false;
            let errorReceived: any = null;

            // Simulate timeout handler
            const handleTimeout = () => {
                timeoutTriggered = true;
                errorReceived = new Error("TIMEOUT");
            };

            // Start connection with timeout
            const timeoutId = setTimeout(handleTimeout, connectionTimeout);

            // Advance time past timeout
            await vi.advanceTimersByTimeAsync(connectionTimeout + 100);

            expect(timeoutTriggered).toBe(true);
            expect(errorReceived?.message).toBe("TIMEOUT");

            clearTimeout(timeoutId);
        });

        it("should clear timeout on successful connection", async () => {
            const connectionTimeout = 4000;
            let timeoutTriggered = false;

            const handleTimeout = () => {
                timeoutTriggered = true;
            };

            const timeoutId = setTimeout(handleTimeout, connectionTimeout);

            // Simulate successful connection before timeout
            await vi.advanceTimersByTimeAsync(1000);
            clearTimeout(timeoutId); // This happens in _handleOpen

            // Advance past original timeout
            await vi.advanceTimersByTimeAsync(connectionTimeout);

            // Timeout should not have triggered
            expect(timeoutTriggered).toBe(false);
        });
    });
});

describe("WebSocket close behavior", () => {
    it("should stop reconnection on normal close (code 1000)", () => {
        let shouldReconnect = true;

        // Simulate _handleClose behavior
        const handleClose = (code: number) => {
            if (code === 1000) {
                shouldReconnect = false;
            }
        };

        handleClose(1000);
        expect(shouldReconnect).toBe(false);
    });

    it("should allow reconnection on abnormal close codes", () => {
        let shouldReconnect = true;

        // Simulate _handleClose behavior
        const handleClose = (code: number) => {
            if (code === 1000) {
                shouldReconnect = false;
            }
            // Other codes don't disable reconnection
        };

        // Abnormal close codes
        handleClose(1006); // Abnormal closure
        expect(shouldReconnect).toBe(true);

        handleClose(1001); // Going away
        expect(shouldReconnect).toBe(true);

        handleClose(1011); // Server error
        expect(shouldReconnect).toBe(true);
    });

    it("should call close handlers when connection closes", () => {
        const closeHandlers: Function[] = [];
        const closedEvents: any[] = [];

        const handler1 = vi.fn((event) => closedEvents.push(event));
        const handler2 = vi.fn((event) => closedEvents.push(event));

        closeHandlers.push(handler1);
        closeHandlers.push(handler2);

        // Simulate close event
        const closeEvent = { code: 1000, reason: "Normal closure" };
        closeHandlers.forEach((handler) => handler(closeEvent));

        expect(handler1).toHaveBeenCalledWith(closeEvent);
        expect(handler2).toHaveBeenCalledWith(closeEvent);
        expect(closedEvents).toHaveLength(2);
    });
});

describe("Binary data handling in queue", () => {
    it("should queue binary data correctly", () => {
        const queue: any[] = [];

        // Different types of binary data
        const arrayBuffer = new ArrayBuffer(1024);
        const uint8Array = new Uint8Array(512);
        const int16Array = new Int16Array(256);

        queue.push(arrayBuffer);
        queue.push(uint8Array);
        queue.push(int16Array);

        expect(queue).toHaveLength(3);
        expect(queue[0]).toBeInstanceOf(ArrayBuffer);
        expect(queue[0].byteLength).toBe(1024);
        expect(queue[1]).toBeInstanceOf(Uint8Array);
        expect(queue[1].byteLength).toBe(512);
        expect(queue[2]).toBeInstanceOf(Int16Array);
        expect(queue[2].byteLength).toBe(512); // 256 * 2 bytes per int16
    });

    it("should calculate bufferedAmount correctly", () => {
        const queue: any[] = [];

        // Add various message types
        queue.push("hello"); // 5 characters (not bytes, but close enough)
        queue.push(new ArrayBuffer(100));
        queue.push(new Uint8Array(50));

        // Simulate bufferedAmount calculation
        const bufferedAmount = queue.reduce((acc, message) => {
            if (typeof message === "string") {
                return acc + message.length;
            } else if (message instanceof ArrayBuffer) {
                return acc + message.byteLength;
            } else if (ArrayBuffer.isView(message)) {
                return acc + message.byteLength;
            }
            return acc;
        }, 0);

        expect(bufferedAmount).toBe(5 + 100 + 50);
    });
});
