export type LogLevel = "silent" | "info" | "debug";

export interface Logger {
  info(message: string): void;
  debug(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function createLogger(level: LogLevel = "info"): Logger {
  const levels: Record<LogLevel, number> = { silent: 0, info: 1, debug: 2 };
  const threshold = levels[level];

  return {
    info(message: string) {
      if (threshold >= 1) {
        console.log(`[unibrowser] ${message}`);
      }
    },
    debug(message: string) {
      if (threshold >= 2) {
        console.log(`[unibrowser:debug] ${message}`);
      }
    },
    warn(message: string) {
      if (threshold >= 1) {
        console.warn(`[unibrowser:warn] ${message}`);
      }
    },
    error(message: string) {
      console.error(`[unibrowser:error] ${message}`);
    },
  };
}

const defaultLogger = createLogger("info");

export function getLogger(): Logger {
  return defaultLogger;
}

export function setLogLevel(level: LogLevel): void {
  Object.assign(defaultLogger, createLogger(level));
}
