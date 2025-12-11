/**
 * Example: Logging Configuration
 *
 * Demonstrates how to configure logging for the SDK.
 */

const { DeepgramClient } = require("../dist/cjs/index.js");
const logging = require("../dist/cjs/core/logging/exports.js");

// Example 1: Basic logging configuration using DeepgramClient
const deepgramClient1 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  logging: {
    level: logging.logging.LogLevel.Debug, // defaults to logging.logging.LogLevel.Info
    logger: new logging.logging.ConsoleLogger(), // defaults to ConsoleLogger
    silent: false, // defaults to true, set to false to enable logging
  },
});

// Example 2: Custom logger using winston
const winston = require("winston");

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const customLogger = {
  debug: (msg, ...args) => winstonLogger.debug(msg, ...args),
  info: (msg, ...args) => winstonLogger.info(msg, ...args),
  warn: (msg, ...args) => winstonLogger.warn(msg, ...args),
  error: (msg, ...args) => winstonLogger.error(msg, ...args),
};

const deepgramClient2 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  logging: {
    level: logging.logging.LogLevel.Info,
    logger: customLogger,
    silent: false,
  },
});

// Example 3: Custom logger using pino
const pino = require("pino");

const pinoLogger = pino({
  level: "info",
});

const pinoCustomLogger = {
  debug: (msg, ...args) => pinoLogger.debug(args, msg),
  info: (msg, ...args) => pinoLogger.info(args, msg),
  warn: (msg, ...args) => pinoLogger.warn(args, msg),
  error: (msg, ...args) => pinoLogger.error(args, msg),
};

const deepgramClient3 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  logging: {
    level: logging.logging.LogLevel.Debug,
    logger: pinoCustomLogger,
    silent: false,
  },
});

// Example usage
async function example() {
  try {
    const { data } = await deepgramClient1.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
    });
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const { data: result2 } = await deepgramClient2.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
    });
    console.log("Result:", result2);
  } catch (error) {
    console.error("Error:", error);
  }

  try {
    const { data: result3 } = await deepgramClient3.listen.v1.media.transcribeUrl({
      url: "https://dpgr.am/spacewalk.wav",
      model: "nova-3",
    });
    console.log("Result:", result3);
  } catch (error) {
    console.error("Error:", error);
  }
}

example();
