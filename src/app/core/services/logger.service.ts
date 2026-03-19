import { Injectable, isDevMode } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0, info: 1, warn: 2, error: 3,
};

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly minLevel: LogLevel = isDevMode() ? 'debug' : 'warn';

  debug(message: string, data?: unknown) { this.log('debug', message, data); }
  info (message: string, data?: unknown) { this.log('info',  message, data); }
  warn (message: string, data?: unknown) { this.log('warn',  message, data); }
  error(message: string, data?: unknown) { this.log('error', message, data); }

  private log(level: LogLevel, message: string, data?: unknown) {
    if (LEVEL_RANK[level] < LEVEL_RANK[this.minLevel]) return;

    const label = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;
    const fn = {
      debug: console.debug,
      info:  console.info,
      warn:  console.warn,
      error: console.error,
    }[level];

    data !== undefined ? fn(label, message, data) : fn(label, message);

    if (!isDevMode() && level === 'error') {
      // TODO: window.Sentry?.captureException({ message, data });
    }
  }
}