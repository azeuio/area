import { Test, TestingModule } from '@nestjs/testing';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { AuthService } from '../firebase/auth/auth.service';

const mockAreaService = {
  create: jest.fn((dto) => {
    return {
      id: 'mockId',
      ...dto,
    };
  }),
  findAll: jest.fn((boardId) => {
    return [
      {
        id: 'mockId',
        board_id: boardId,
      },
    ];
  }),
};

const mockAuthService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUidFromRequest: jest.fn((req) => {
    return 'mockUid';
  }),
};

describe('AreaController', () => {
  let controller: AreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [AreaService, AuthService],
    })
      .overrideProvider(AreaService)
      .useValue(mockAreaService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AreaController>(AreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
