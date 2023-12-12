import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthService } from '../firebase/auth/auth.service';

const mockBoardsService = {
  create: jest.fn((createBoardDto, uid) => 'mockBoardId'),
  findAll: jest.fn((uid) => []),
  findOne: jest.fn((id, uid) => ({ id, name: 'mockBoardName' })),
  update: jest.fn((id, updateBoardDto, uid) => ({
    id,
    name: 'mockBoardName',
  })),
  remove: jest.fn((id, uid) => undefined),
};

const mockAuthService = {
  getUidFromRequest: jest.fn((req) => 'mockUid'),
};

describe('BoardsController', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [BoardsService, AuthService],
    })
      .overrideProvider(BoardsService)
      .useValue(mockBoardsService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
