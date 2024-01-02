import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public request: Request;
  constructor(public authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.request = context.switchToHttp().getRequest();
    return (await this.validateToken(this.request)) ? true : false;
  }

  async validateToken(request: Request) {
    const token = request?.headers?.authorization?.split?.('Bearer ')?.[1];
    if (!token) {
      return false;
    }

    return await this.authService.checkToken(token);
  }
}

@Injectable()
export class AuthGuardVerifiedEmail extends AuthGuard {
  async validateToken(request: Request) {
    const token = await super.validateToken(request);
    if (token && !token.email_verified) {
      throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);
    }
    return token;
  }
}

export class AuthGuardIsOwnerMixin extends AuthGuard {
  public idRef: string;
  public errorMessages?: {
    invalidToken?: string;
    isNotUser?: string;
  };

  async validateToken(request: Request) {
    const idRefPath = this.idRef.split('.');
    if (!request?.params && idRefPath.length > 0) {
      throw new HttpException(
        'Cannot find id in request params',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const initial = Object.entries(request.params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {},
    );
    const id = idRefPath.reduce((acc, cur) => acc[cur], initial);
    const token = await super.validateToken(request);
    if (!token && this.errorMessages?.invalidToken) {
      throw new HttpException(
        this.errorMessages.invalidToken,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (token && token.uid !== id) {
      throw new HttpException(
        this.errorMessages?.isNotUser || 'Resource does not belong to the user',
        HttpStatus.FORBIDDEN,
      );
    }

    return token;
  }
}

export const AuthGuardIsOwner = (
  idRef: string, // 'boardId.owner_id, userId, ...'
  errorMessages?: {
    invalidToken?: string;
    isNotUser?: string;
  },
) => {
  const guard = mixin(AuthGuardIsOwnerMixin);
  guard.prototype.idRef = idRef;
  guard.prototype.errorMessages = errorMessages;
  return guard;
};
