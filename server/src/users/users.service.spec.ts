import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../firebase/database/database.service';
import { AuthService } from '../firebase/auth/auth.service';

const mockDatabaseService = {
  usersRefId: 'users',
  getData: jest.fn(),
  pushData: jest.fn(),
  updateData: jest.fn(),
};

const mockAuthService = {
  unregister: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService, AuthService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
