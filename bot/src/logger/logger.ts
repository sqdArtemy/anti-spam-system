import { createLogger, format, transports } from "winston";

const initializeLogger = () => {
  const logFormat = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  });
  const logger = (serviceName: string) => {
    return createLogger({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        logFormat
      ),
      defaultMeta: { service: serviceName },
      transports: [
        new transports.Console(),
        new transports.File({
          filename: "./logs/system.log",
          level: "info",
          format: format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            format.json()
          ),
        }),
      ],
    });
  };
  return {
    system: logger("system"),
    bot: logger("bot"),
  };
};

export const logger = initializeLogger();
