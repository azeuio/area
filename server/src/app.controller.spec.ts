import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DatabaseService } from './firebase/database/database.service';

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
  getData: jest.fn().mockImplementation((path: string) => {
    return mockData[path];
  }),
};

describe('ActionsController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return about.json', async () => {
    const aboutJson = await controller.getAbout({ ip: '1.2.3.4' } as any);
    expect(aboutJson).toEqual({
      client: {
        host: '1.2.3.4',
      },
      server: {
        current_time: expect.any(Number),
        services: [
          {
            name: 'service-name',
            actions: [
              {
                name: 'action-name',
                description: 'action-description',
              },
            ],
            reactions: [
              {
                name: 'action-name',
                description: 'action-description',
              },
            ],
          },
          {
            name: 'service-name-2',
            actions: [
              {
                name: 'action-name-2',
                description: 'action-description-2',
              },
            ],
            reactions: [
              {
                name: 'action-name-2',
                description: 'action-description-2',
              },
            ],
          },
        ],
      },
    });
  });
});
