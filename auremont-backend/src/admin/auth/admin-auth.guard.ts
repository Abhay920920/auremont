import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, SetMetadata, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const ROLES_KEY = 'admin_roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Admin authorization guard
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  private reflector: Reflector;

  constructor(
    private jwtService: JwtService,
    @Optional() reflector?: Reflector,
  ) {
    this.reflector = reflector || new Reflector();
  }

  /**
   * Checks if admin can activate route
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Admin token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'AUREMONT_LUXURY_SECRET_KEY',
      });
      const adminId = payload.sub || payload.id;
      request['admin'] = {
        ...payload,
        id: adminId,
        sub: adminId,
      };
    } catch {
      throw new UnauthorizedException('Invalid admin token');
    }

    // Role-based authorization
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No specific role required, just valid admin JWT
    }

    const { role } = request['admin'];
    const uppercaseRole = role ? role.toUpperCase() : '';
    if (uppercaseRole === 'SUPER_ADMIN') {
      return true;
    }

    if (!requiredRoles.includes(uppercaseRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
