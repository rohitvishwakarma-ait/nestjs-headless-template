import { Logger } from '@nestjs/common';

// Handbook: centralized logger — never use console.log
// Replace with Winston/Pino for production
export class AppLogger extends Logger {
  log(message: string, context?: string): void {
    super.log(message, context);
  }

  warn(message: string, context?: string): void {
    super.warn(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context);
  }
}
