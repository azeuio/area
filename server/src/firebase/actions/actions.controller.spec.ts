import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { DatabaseModule } from '../database/database.module';

const mockDatabaseService = {
  getRef: jest.fn().mockReturnThis(),
  child: jest.fn().mockReturnThis(),
  once: jest.fn().mockReturnThis(),
  orderByChild: jest.fn().mockReturnThis(),
  equalTo: jest.fn().mockReturnThis(),
  get: jest.fn().mockImplementation(() => {
    return {
      exists: jest.fn().mockReturnValue(true),
    };
  }),
};

describe('ActionsController', () => {
  let controller: ActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [ActionsService],
      imports: [DatabaseModule],
    })
      .overrideProvider(DatabaseModule)
      .useValue(mockDatabaseService)
      .compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
