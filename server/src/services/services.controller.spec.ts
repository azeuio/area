import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../firebase/auth/auth.service';
import { DatabaseService } from '../firebase/database/database.service';
import { BoardsService } from '../boards/boards.service';
import { UsersService } from '../users/users.service';
import { SpotifyService } from './spotify/spotify.service';
import { GmailService } from './gmail/gmail.service';

const mockConfigService = () => ({
  get: jest.fn(),
});

const mockDatabaseService = () => ({
  getAuth: jest.fn(),
  setData: jest.fn(),
  usersRefId: jest.fn(),
});

const mockBoardsService = () => ({
  getBoard: jest.fn(),
  getBoards: jest.fn(),
  createBoard: jest.fn(),
  updateBoard: jest.fn(),
  deleteBoard: jest.fn(),
});

const mockUsersService = () => ({
  getUser: jest.fn(),
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
});

const mockAuthService = () => ({
  getUidFromRequest: jest.fn(),
  getUidFromToken: jest.fn(),
  genereteEmailVerificationLink: jest.fn(),
  register: jest.fn(),
  createUser: jest.fn(),
  unregister: jest.fn(),
});

const mockSpotifyService = () => ({
  getUidFromRequest: jest.fn(),
  getUidFromToken: jest.fn(),
  genereteEmailVerificationLink: jest.fn(),
  register: jest.fn(),
  createUser: jest.fn(),
  unregister: jest.fn(),
});

const mockGmailService = () => ({
  getUidFromRequest: jest.fn(),
  getUidFromToken: jest.fn(),
  genereteEmailVerificationLink: jest.fn(),
  register: jest.fn(),
  createUser: jest.fn(),
  unregister: jest.fn(),
});

describe('ServicesController', () => {
  let controller: ServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        ConfigService,
        AuthService,
        DatabaseService,
        BoardsService,
        UsersService,
        SpotifyService,
        GmailService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .overrideProvider(BoardsService)
      .useValue(mockBoardsService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(SpotifyService)
      .useValue(mockSpotifyService)
      .overrideProvider(GmailService)
      .useValue(mockGmailService)
      .compile();

    controller = module.get<ServicesController>(ServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
