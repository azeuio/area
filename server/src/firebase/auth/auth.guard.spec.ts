import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard, AuthGuardIsOwnerMixin } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthGuardVerifiedEmail } from './auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

const validRequest: Request = {
  headers: { authorization: 'Bearer validToken' },
} as Request;
const validToken = {
  email_verified: true,
};
const validIdRequest: Request = {
  headers: {
    authorization: 'Bearer validIdToken',
  },
  params: { userId: 'userId' } as any,
} as Request;
const validIdToken = {
  uid: 'userId',
  email_verified: true,
};
const validNestedIdRequest: Request = {
  headers: {
    authorization: 'Bearer validIdToken',
  },
  params: { user: { userId: 'userId' } } as any,
} as Request;
const invalidRequest: Request = {
  headers: { authorization: 'Bearer invalidToken' },
  params: { userId: 'userId' } as any,
} as Request;
const invalidEmailRequest: Request = {
  headers: { authorization: 'Bearer invalidEmail' },
} as Request;
const invalidEmailToken = {
  uid: 'userId',
  email_verified: false,
};
const invalidIdRequest: Request = {
  headers: {
    authorization: 'Bearer invalidId',
  },
  params: { userId: 'userId' } as any,
} as Request;
const invalidIdToken = {
  uid: 'invalidId',
  email_verified: true,
};

const mockAuthService = () => ({
  genereteEmailVerificationLink: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  checkToken: jest.fn((token) => {
    if (token === 'validToken') {
      return validToken;
    }
    if (token === 'validIdToken') {
      return validIdToken;
    }
    if (token === 'invalidToken') {
      return false;
    }
    if (token === 'invalidEmail') {
      return invalidEmailToken;
    }
    if (token === 'invalidId') {
      return invalidIdToken;
    }
    return false;
  }),
});

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService())
      .compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call validateToken', async () => {
    const spy = jest.spyOn(guard, 'validateToken');
    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should call checkToken', async () => {
    const spy = jest.spyOn(guard.authService, 'checkToken');
    await guard.validateToken(validRequest);
    expect(spy).toHaveBeenCalled();
  });

  it('should return false if token is invalid', async () => {
    const result = await guard.validateToken(invalidRequest);
    expect(result).toBeFalsy();
  });
});

describe('AuthGuardVerifiedEmail', () => {
  let guard: AuthGuardVerifiedEmail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuardVerifiedEmail, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService())
      .compile();

    guard = module.get<AuthGuardVerifiedEmail>(AuthGuardVerifiedEmail);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call validateToken', async () => {
    const spy = jest.spyOn(guard, 'validateToken');
    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should call checkToken', async () => {
    const spy = jest.spyOn(guard.authService, 'checkToken');
    await guard.validateToken(validRequest);
    expect(spy).toHaveBeenCalled();
  });

  it('should throw an HttpException if email is not verified', async () => {
    await expect(guard.validateToken(invalidEmailRequest)).rejects.toThrow(
      new HttpException('Email not verified', HttpStatus.UNAUTHORIZED),
    );
  });

  it('should return the token if email is verified', async () => {
    const token = validToken;
    const result = await guard.validateToken(validRequest);
    expect(result).toEqual(token);
  });
});
describe('AuthGuardIsUser', () => {
  let guard: AuthGuardIsOwnerMixin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuardIsOwnerMixin,
        AuthService,
        {
          provide: 'idRef',
          useValue: 'userId',
        },
        {
          provide: 'errorMessages',
          useValue: {
            invalidToken: 'Invalid token',
            isNotUser: 'Not your account',
          },
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService())
      .compile();

    guard = module.get<AuthGuardIsOwnerMixin>(AuthGuardIsOwnerMixin);
    guard.idRef = 'userId';
    guard.errorMessages = {
      invalidToken: 'Invalid token',
      isNotUser: 'Not your account',
    };
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should call validateToken', async () => {
    const spy = jest.spyOn(guard, 'validateToken');
    await guard.canActivate({
      switchToHttp: () => ({ getRequest: () => validIdRequest }),
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should call checkToken', async () => {
    const spy = jest.spyOn(guard.authService, 'checkToken');
    await guard.validateToken(validIdRequest);
    expect(spy).toHaveBeenCalled();
  });

  it('should throw an HttpException if token is invalid', async () => {
    await expect(guard.validateToken(invalidRequest)).rejects.toThrow(
      new HttpException('Invalid token', HttpStatus.UNAUTHORIZED),
    );
  });

  it('should throw an HttpException if token does not match the user id', async () => {
    await expect(guard.validateToken(invalidIdRequest)).rejects.toThrow(
      new HttpException('Not your account', HttpStatus.FORBIDDEN),
    );
  });

  it('should return the token if token matches the user id', async () => {
    const token = validIdToken;
    const result = await guard.validateToken(validIdRequest);
    expect(result).toEqual(token);
  });

  it('should work with nested params', async () => {
    guard.idRef = 'user.userId';
    const token = validIdToken;
    const result = await guard.validateToken(validNestedIdRequest);
    expect(result).toEqual(token);
  });
});
