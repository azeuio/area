import { Test, TestingModule } from '@nestjs/testing';
import { AreaService } from './area.service';
import { DatabaseService } from '../firebase/database/database.service';

const mockDatabaseService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getData: jest.fn((path) => {
    return {
      owner_id: 'mockUid',
    };
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pushData: jest.fn((path, data) => {
    return {
      key: 'mockId',
    };
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRef: jest.fn((path) => {
    return {
      orderByChild: jest.fn((child) => {
        return {
          equalTo: jest.fn((value) => {
            return {
              once: jest.fn((value) => {
                return {
                  val: jest.fn(() => {
                    return {
                      mockId: {
                        board_id: value,
                      },
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };
  }),
};

describe('AreaService', () => {
  let service: AreaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    service = module.get<AreaService>(AreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
