import { ISPUBLIC } from '@/lib/decorator/public.decorator';
import { ROLES_KEY } from '@/lib/decorator/roles.decorator';
import { PayloadJwt } from '@/lib/dto/AuthDto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(ISPUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: PayloadJwt }>();
    const userRole = request.user?.role;

    if (!userRole) {
      throw new ForbiddenException(
        'Unauthenticated user or user without a defined role.',
      );
    }

    if (userRole === 'ADMIN') return true;

    const hasRole = roles.some((role) => role == userRole);

    if (!hasRole)
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );

    return true;
  }
}
