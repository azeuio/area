import { Test, TestingModule } from '@nestjs/testing';
import { ActionsService } from './actions.service';
import { DatabaseService } from '../database/database.service';

const mockData = {
  services: {
    'service-id': {
      name: 'service-name',
      description: 'service-description',
    },
    'service-id-2': {
      name: 'service-name-2',
      description: 'service-description-2',
    },
  },
  actions: {
    'action-id': {
      name: 'action-name',
      description: 'action-description',
      service_id: 'service-id',
    },
    'action-id-2': {
      name: 'action-name-2',
      description: 'action-description-2',
      service_id: 'service-id-2',
    },
  },
};

const mockDatabaseService = {
  getRef: jest.fn().mockReturnThis(),
  child: jest.fn().mockReturnThis(),
  once: jest.fn().mockReturnThis(),
  orderByChild: jest.fn().mockReturnThis(),
  equalTo: jest.fn().mockImplementation((serviceId: string) => {
    return {
      once: jest.fn().mockImplementation(() => {
        return {
          val: jest.fn().mockImplementation(() => {
            const actions = Object.values(mockData.actions).filter(
              (action) => action.service_id === serviceId,
            );
            return actions;
          }),
        };
      }),
    };
  }),
  get: jest.fn().mockImplementation(() => {
    return {
      exists: jest.fn().mockReturnValue(true),
    };
  }),
  getData: jest.fn().mockImplementation((path: string) => {
    return mockData[path];
  }),
  val: jest.fn().mockImplementation(() => {
    return mockData;
  }),
};

describe('ActionsService', () => {
  let service: ActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    service = module.get<ActionsService>(ActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find actions from service', async () => {
    const actions = await service.findFromService('service-id');
    expect(actions).toEqual([
      {
        name: 'action-name',
        description: 'action-description',
        service_id: 'service-id',
      },
    ]);
  });
});
