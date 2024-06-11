import { Test, TestingModule } from '@nestjs/testing';
import { BeaconController } from '../beacon.controller';
import { UtilsModule } from '../../utils/utils.module';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { BeaconService } from '../beacon.service';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import {
  mockedSyncNodeResults,
  mockedSyncResults,
  mockEpochCacheValue,
  mockValCacheValues
} from '../../../../src/mocks/beacon';
import { StatusColor } from '../../../../src/types';

describe('BeaconController', () => {
  let controller: BeaconController;
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
        })
      ],
      providers: [
        BeaconService
      ],
      controllers: [BeaconController],
    })
      .overrideProvider(CACHE_MANAGER).useValue(mockCacheManager)
      .overrideProvider(HttpService).useValue(mockHttpService)
      .compile();

    controller = module.get<BeaconController>(BeaconController);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpService = module.get<HttpService>(HttpService);

    mockCacheManager.get.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get beacon spec from cache', async () => {
    const mockBeaconSpec = { data: 'mock-specs' };
    mockCacheManager.get.mockResolvedValueOnce(mockBeaconSpec);

    const result = await controller.getBeaconSpec();
    expect(result).toEqual(mockBeaconSpec);
    expect(mockCacheManager.get).toHaveBeenCalledWith('specs');
  });

  describe('getBeaconNodeVersion', () => {
    it('should get beacon node version from cache', async () => {
      const mockBeaconNodeVersion = { data: 'mock-version' };
      mockCacheManager.get.mockResolvedValue(mockBeaconNodeVersion);

      const result = await controller.getBeaconNodeVersion();
      expect(result).toEqual(mockBeaconNodeVersion);
      expect(mockCacheManager.get).toHaveBeenCalledWith('bnVersion');
    });

    it('should get beacon node version from node if empty cache', async () => {
      const mockBeaconNodeVersion = { data: 'mock-version' };
      const httpResponse: AxiosResponse = { data: { data: mockBeaconNodeVersion } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpResponse));
      mockCacheManager.get.mockResolvedValueOnce(null);

      const result = await controller.getBeaconNodeVersion();

      expect(result).toEqual(mockBeaconNodeVersion);
      expect(httpService.request).toHaveBeenCalled();
    });
  })

  describe('getNodeGenesis', () => {
    it('should get genesis from cache', async () => {
      const mockCacheValue = { data: 'mock-time' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getNodeGenesis();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('genesis');
    });

    it('should get genesis from node if empty cache', async () => {
      const httpResponse: AxiosResponse = { data: { data: { genesis_time: '1' } } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpResponse));
      mockCacheManager.get.mockResolvedValueOnce(null);


      const result = await controller.getNodeGenesis();
      expect(result).toEqual(1);
    });
  })

  describe('getSyncData', () => {
    it('should fetch data from cache', async () => {
      const mockCacheValue = { data: 'mock-sync' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getSyncData();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('syncData');
    });

    it('should return correct data from node', async () => {
      const httpBeaconResponse: AxiosResponse = { data: { data: mockedSyncNodeResults.beacon } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const httpExecutionResponse: AxiosResponse = { data: { data: mockedSyncNodeResults.execution } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpExecutionResponse));

      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });

      const result = await controller.getSyncData();
      expect(result).toEqual(mockedSyncResults);
    });
  })

  describe('getInclusionData', () => {
    it('should fetch data from cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SLOTS_PER_EPOCH: '32' });
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      const mockCacheValue = { data: 'mock' };
      mockCacheManager.get.mockResolvedValueOnce(mockCacheValue);

      const result = await controller.getInclusionData();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('inclusionRate');
    });

    it('should return correct data from node', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SLOTS_PER_EPOCH: '32' });
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockCacheManager.get.mockResolvedValueOnce({beaconSync: {headSlot: 12}});

      const httpExecutionResponse: AxiosResponse = { data: { data: {
            previous_epoch_target_attesting_gwei: 100,
            current_epoch_active_gwei: 100,
          } } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpExecutionResponse));

      const result = await controller.getInclusionData();
      expect(result).toEqual({
        rate: 100,
        status: StatusColor.SUCCESS
      });
    });
  })

  describe('getPeerData', () => {
    it('should get data from cache', async () => {
      const mockCacheValue = { data: 'mock-peer' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getPeerData();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('peerData');
    });

    it('should return correct data from node', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });

      const httpBeaconResponse: AxiosResponse = { data: { data: {connected: '100'} } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const result = await controller.getPeerData();
      expect(result).toEqual({connected: 100});
    });
  })

  describe('getValidatorCount', () => {
    it('should get data from cache', async () => {
      const mockCacheValue = { data: 'mock-count' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getValidatorCount();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('validatorCount');
    });

    it('should return correct data from node', async () => {
      const httpBeaconResponse: AxiosResponse = { data: { data: 100 } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const result = await controller.getValidatorCount();
      expect(result).toEqual(100);
    });
  })

  describe('getProposerDuties', () => {
    it('should get data from cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockEpochCacheValue);
      const mockCacheValue = { data: 'mock-duties' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getProposerDuties();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('proposerDuties');
    });
    it('should return correct data from node', async () => {
      mockCacheManager.get.mockResolvedValueOnce(mockEpochCacheValue);
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockCacheManager.get.mockResolvedValueOnce(mockValCacheValues);
      mockCacheManager.get.mockResolvedValueOnce({beaconSync: {headSlot: 12}});

      const httpBeaconResponse: AxiosResponse = { data: { data: [
            {
              pubkey: 'fake-pub',
              validator_index: '1',
              slot: '123',
            }
          ] } } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const result = await controller.getProposerDuties();
      expect(result).toEqual([{"pubkey": "fake-pub", "slot": "123", "uuid": "1231", "validator_index": "1"}]);
    });
  })
});
