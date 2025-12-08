/**
 * Example: Logging Configuration
 * 
 * Demonstrates how to configure logging for the SDK.
 */

const { createClient, DeepgramClient, LogLevel, ConsoleLogger } = require("@deepgram/sdk");

// Example 1: Basic logging configuration using DeepgramClient
const deepgramClient1 = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
  logging: {
    level: logging.LogLevel.Debug, // defaults to logging.LogLevel.Info
    logger: new logging.ConsoleLogger(), // defaults to ConsoleLogger
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
    level: logging.LogLevel.Info,
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
    level: logging.LogLevel.Debug,
    logger: pinoCustomLogger,
    silent: false,
  },
});

// Example usage
async function example() {
  const { result, error } = await deepgramClient1.listen.prerecorded.transcribeUrl(
    { url: "https://dpgr.am/spacewalk.wav" },
    {
      model: "nova-3",
    }
  );

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Result:", result);
}

example()

