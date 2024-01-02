import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { DatabaseService } from '../firebase/database/database.service';
import { BoardsService } from '../boards/boards.service';
import { SpotifyService } from './spotify/spotify.service';
import { UsersService } from '../users/users.service';

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

const mockSpotifyService = () => ({
  getUidFromRequest: jest.fn(),
  getUidFromToken: jest.fn(),
  genereteEmailVerificationLink: jest.fn(),
  register: jest.fn(),
  createUser: jest.fn(),
  unregister: jest.fn(),
});

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        DatabaseService,
        BoardsService,
        SpotifyService,
        UsersService,
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService())
      .overrideProvider(BoardsService)
      .useValue(mockBoardsService())
      .overrideProvider(SpotifyService)
      .useValue(mockSpotifyService())
      .overrideProvider(UsersService)
      .useValue(mockUsersService())
      .compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
