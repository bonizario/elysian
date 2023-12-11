import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as UserPayload;
  },
);
