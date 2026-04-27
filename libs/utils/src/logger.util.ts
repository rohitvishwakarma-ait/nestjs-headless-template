import { ConsoleLogger, LogLevel } from '@nestjs/common';

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

  error(message: string, trace?: string, context?: string): void {
    this.isProduction
      ? this.writeJson('error', message, context, trace)
      : super.error(message, trace, context);
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
}
