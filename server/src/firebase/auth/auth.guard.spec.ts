import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

const mockAuthService = () => ({
  genereteEmailVerificationLink: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  checkToken: jest.fn(),
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
});
