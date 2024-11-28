import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from '../node.controller';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { UtilsModule } from '../../utils/utils.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { NodeService } from '../node.service';
import { AxiosResponse } from 'axios/index';
import { of } from 'rxjs';
import { mockDiagnostics } from '../../../../src/mocks/beaconSpec';

describe('NodeController', () => {
  let controller: NodeController;

  let cacheManager: Cache;
  let httpService: HttpService;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockHttpService = {
    request: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UtilsModule,
        CacheModule.register(),
        JwtModule.register({
          global: true,
          secret: 'fake-value',
          signOptions: { expiresIn: '7200s' }, // set to 2 hours
        }),
      ],
      providers: [NodeService],
      controllers: [NodeController],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    controller = module.get<NodeController>(NodeController);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpService = module.get<HttpService>(HttpService);

    mockCacheManager.get.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealthData', () => {
    it('should return cached data', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      const mockCacheValue = { data: 'mock-health' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getHealthData();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('nodeHealth');
    });

    it('should return correct data from node', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });

      const httpBeaconResponse: AxiosResponse = {
        data: {
          data: {
            disk_bytes_free: '132070244352',
            disk_bytes_total: '132070244352',
            used_memory: '16',
            total_memory: '132070244352',
            sys_loadavg_5: 5.95,
            app_uptime: 600,
            network_name: 'example',
            nat_open: false,
            global_cpu_frequency: 100,
          },
        },
      } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const httpVcResponse: AxiosResponse = {
        data: { data: { app_uptime: 600 } },
      } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpVcResponse));

      const result = await controller.getHealthData();
      expect(result).toEqual(mockDiagnostics);
    });
  });
});
