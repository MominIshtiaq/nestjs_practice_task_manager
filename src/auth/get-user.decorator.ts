import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: User;
}

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.user;
  },
);
