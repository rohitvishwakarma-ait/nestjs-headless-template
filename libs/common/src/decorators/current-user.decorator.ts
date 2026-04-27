import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Handbook pattern: clean auth access via custom decorator
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: unknown }>();
    return request.user;
  },
);
