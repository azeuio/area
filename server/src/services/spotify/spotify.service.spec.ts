import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import { ConfigService } from '@nestjs/config';

const mockConfigService = () => ({
  get: jest.fn(),
});

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService())
      .compile();

    service = module.get<SpotifyService>(SpotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
