import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const id = ctx.switchToHttp().getRequest().user.id;
    return id;
  },
);
