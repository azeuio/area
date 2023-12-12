import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return (await this.validateToken(request)) ? true : false;
  }

  async validateToken(request) {
    const token = request?.headers?.authorization?.split?.('Bearer ')?.[1];
    if (!token) {
      return false;
    }

    return await this.authService.checkToken(token);
  }
}

@Injectable()
export class AuthGuardVerifiedEmail implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return (await this.validateToken(request)) ? true : false;
  }

  async validateToken(request) {
    const token = request?.headers?.authorization?.split?.('Bearer ')?.[1];
    if (!token) {
      return false;
    }

    const verifiedToken = await this.authService.checkToken(token);
    if (verifiedToken && !verifiedToken.email_verified) {
      return false;
    }
    return verifiedToken;
  }
}
