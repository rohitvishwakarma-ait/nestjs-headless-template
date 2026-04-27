import { ConsoleLogger, LogLevel } from '@nestjs/common';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOG_DIR = join(process.cwd(), 'logs');
const ERROR_LOG_FILE = join(LOG_DIR, 'error.log');

// Ensure logs/ directory exists at startup
try {
  mkdirSync(LOG_DIR, { recursive: true });
} catch {
  // already exists — safe to ignore
}

export class AppLogger extends ConsoleLogger {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  log(message: string, context?: string): void {
    this.isProduction
      ? this.writeJson('log', message, context)
      : super.log(message, context);
  }

  warn(message: string, context?: string): void {
    this.isProduction
      ? this.writeJson('warn', message, context)
      : super.warn(message, context);
  }

  // 500 errors → console + logs/error.log
  error(message: string, trace?: string, context?: string): void {
    if (this.isProduction) {
      this.writeJson('error', message, context, trace);
    } else {
      super.error(message, trace, context);
    }
    // Always write 500 errors to file regardless of environment
    this.writeErrorFile(message, context, trace);
  }

  debug(message: string, context?: string): void {
    if (!this.isProduction) super.debug(message, context);
  }

  private writeJson(
    level: LogLevel,
    message: string,
    context?: string,
    trace?: string,
  ): void {
    const entry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      context: context ?? this.context,
      message,
    };
    if (trace) entry['trace'] = trace;
    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  private writeErrorFile(
    message: string,
    context?: string,
    trace?: string,
  ): void {
    const entry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: 'error',
      context: context ?? this.context,
      message,
    };
    if (trace) entry['trace'] = trace;

    try {
      appendFileSync(ERROR_LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
    } catch {
      // file write failure should never crash the app
    }
  }
}
