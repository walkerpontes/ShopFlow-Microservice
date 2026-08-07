import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadJwt } from '../dto/AuthDto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user?: PayloadJwt }>();
    return request.user;
  },
);
