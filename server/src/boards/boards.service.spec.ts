import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { DatabaseService } from '../firebase/database/database.service';

const mockData = {
  mockBoardId: {
    name: 'mockBoardName',
    description: 'mockBoardDesc',
    owner_id: 'mockUid',
  },
  mockBoardId2: {
    name: 'mockBoardName2',
    description: 'mockBoardDesc2',
    owner_id: 'mockUid',
  },
  mockBoardId3: {
    name: 'mockBoardName3',
    description: 'mockBoardDesc3',
    owner_id: 'mockUid2',
  },
};

const mockDatabaseService = {
  pushData: jest.fn((refId, data) => ({
    key: 'mockBoardId',
  })),
  getRef: jest.fn((refId) => ({
    orderByChild: jest.fn((child) => ({
      equalTo: jest.fn((uid) => ({
        once: jest.fn(() => ({
          val: jest.fn(() => ({
            mockBoardId: mockData.mockBoardId,
            mockBoardId2: mockData.mockBoardId2,
          })),
        })),
      })),
    })),
  })),
  getData: jest.fn((refId) => mockData[refId.split('/')[1]]),
  updateData: jest.fn((refId, data) => ({
    ...mockData[refId.split('/')[1]],
    ...data,
  })),
};

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardsService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a board', async () => {
    const boardId = await service.create(
      {
        name: 'mockBoardName',
        description: 'mockBoardDesc',
      },
      'mockUid',
    );
    expect(boardId).toEqual('mockBoardId');
  });

  it('should find all boards', async () => {
    const boards = await service.findAll('mockUid');
    expect(boards).toEqual([
      {
        id: 'mockBoardId',
        name: 'mockBoardName',
        description: 'mockBoardDesc',
      },
      {
        id: 'mockBoardId2',
        name: 'mockBoardName2',
        description: 'mockBoardDesc2',
      },
    ]);
  });

  it('should find one board', async () => {
    const board = await service.findOne('mockBoardId', 'mockUid');
    expect(board).toEqual({
      id: 'mockBoardId',
      name: 'mockBoardName',
      description: 'mockBoardDesc',
    });
  });

  it('should not find one board', async () => {
    await expect(
      service.findOne('mockBoardId3', 'mockUid'),
    ).rejects.toThrowError('Board not found');
  });

  it('should update a board', async () => {
    const board = await service.update(
      'mockBoardId',
      {
        name: 'newMockBoardName',
        description: 'mockBoardDesc',
      },
      'mockUid',
    );
    expect(board).toEqual({
      id: 'mockBoardId',
      name: 'newMockBoardName',
      description: 'mockBoardDesc',
    });
  });

  it('should not update a board', async () => {
    await expect(
      service.update(
        'mockBoardId3',
        {
          name: 'newMockBoardName',
          description: 'mockBoardDesc',
        },
        'mockUid',
      ),
    ).rejects.toThrowError('Board not found');
  });
});
