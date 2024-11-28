import { Test, TestingModule } from '@nestjs/testing';
import { ValidatorController } from '../validator.controller';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { UtilsModule } from '../../utils/utils.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { ValidatorService } from '../validator.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import {
  mockFormattedStates,
  mockStateResults,
  mockValCacheValues,
} from '../../../../src/mocks/beacon';
import {
  mockValCacheResults,
  mockValInfoResult,
} from '../../../../src/mocks/validatorResults';
import { SequelizeModule } from '@nestjs/sequelize';
import { Metric } from '../entities/metric.entity';
import { Sequelize } from 'sequelize-typescript';
import { ActivityModule } from '../../activity/activity.module';

describe('ValidatorController', () => {
  let controller: ValidatorController;

  let cacheManager: Cache;
  let httpService: HttpService;
  let sequelize: Sequelize;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockHttpService = {
    request: jest.fn(),
  };

  beforeEach(async () => {
    process.env.VALIDATOR_URL = 'mock-url';
    process.env.API_TOKEN = 'mock-api-token';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UtilsModule,
        ActivityModule,
        CacheModule.register(),
        SequelizeModule.forFeature([Metric]),
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          autoLoadModels: true,
          synchronize: true,
        }),
        JwtModule.register({
          global: true,
          secret: 'fake-value',
          signOptions: { expiresIn: '7200s' },
        }),
      ],
      providers: [ValidatorService],
      controllers: [ValidatorController],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    controller = module.get<ValidatorController>(ValidatorController);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpService = module.get<HttpService>(HttpService);
    sequelize = module.get<Sequelize>(Sequelize);

    mockCacheManager.get.mockResolvedValue(null);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getValidatorAuth should return correct auth path', async () => {
    const httpVcResponse: AxiosResponse = {
      data: { data: 'mock-auth-key' },
    } as AxiosResponse;
    mockHttpService.request.mockReturnValueOnce(of(httpVcResponse));

    const results = await controller.getValidatorAuth();

    expect(results).toEqual({ data: 'mock-auth-key' });
    expect(mockHttpService.request).toBeCalledWith({
      method: 'GET',
      url: 'mock-url/lighthouse/auth',
    });
  });

  it('should call getValidatorVersion and return correct version', async () => {
    const httpVcResponse: AxiosResponse = {
      data: { data: 'mock-version' },
    } as AxiosResponse;
    mockHttpService.request.mockReturnValueOnce(of(httpVcResponse));

    const results = await controller.getValidatorVersion();

    expect(results).toEqual('mock-version');
    expect(mockHttpService.request).toBeCalledWith({
      headers: { Authorization: 'Bearer mock-api-token' },
      method: 'GET',
      url: 'mock-url/lighthouse/version',
    });
  });

  describe('getValidatorStates', () => {
    it('should fetch data from cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      const mockCacheValue = { data: 'mock-state' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getValidatorStates();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('valStates');
    });

    it('should return correct data from node', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockCacheManager.get.mockResolvedValueOnce([
        {
          index: '1',
          pubkey: 'mock-pubkey',
          status: 'active_ongoing',
          withdrawal_credentials: 'fake-creds',
        },
      ]);

      const httpBeaconResponse: AxiosResponse = {
        data: { data: mockStateResults },
      } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const result = await controller.getValidatorStates();
      expect(result).toEqual(mockFormattedStates);
    });
  });

  describe('getValidatorCaches', () => {
    it('should fetch data from cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      const mockCacheValue = { data: 'mock-cache' };
      mockCacheManager.get.mockResolvedValue(mockCacheValue);

      const result = await controller.getValidatorCaches();
      expect(result).toEqual(mockCacheValue);
      expect(mockCacheManager.get).toHaveBeenCalledWith('valCache');
    });

    it('should return correct data from node', async () => {
      mockCacheManager.get.mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' });
      mockCacheManager.get.mockResolvedValueOnce(null);
      mockCacheManager.get.mockResolvedValueOnce(mockValCacheValues);

      const httpBeaconResponse: AxiosResponse = {
        data: { data: mockValInfoResult },
      } as AxiosResponse;
      mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

      const result = await controller.getValidatorCaches();
      expect(result).toEqual(mockValCacheResults);
    });
  });

  describe('getValidatorMetrics', () => {
    it('should fetch all metrics from db', async () => {
      await Metric.bulkCreate([
        {
          id: 1,
          index: '1',
          data: JSON.stringify({
            attestation_target_hit_percentage: 90,
            attestation_hit_percentage: 95,
          }),
        },
        {
          id: 2,
          index: '2',
          data: JSON.stringify({
            attestation_target_hit_percentage: 90,
            attestation_hit_percentage: 95,
          }),
        },
        {
          id: 3,
          index: '3',
          data: JSON.stringify({
            attestation_target_hit_percentage: 90,
            attestation_hit_percentage: 95,
          }),
        },
      ]);

      const results = await controller.getValidatorMetrics();
      expect(results).toEqual({
        hitEffectiveness: 95,
        targetEffectiveness: 90,
        totalEffectiveness: 92.5,
      });
    });
    it('should fetch metrics by id', async () => {
      await Metric.bulkCreate([
        {
          id: 1,
          index: '1',
          data: JSON.stringify({
            attestation_target_hit_percentage: 90,
            attestation_hit_percentage: 95,
          }),
        },
        {
          id: 2,
          index: '1',
          data: JSON.stringify({
            attestation_target_hit_percentage: 100,
            attestation_hit_percentage: 100,
          }),
        },
        {
          id: 3,
          index: '2',
          data: JSON.stringify({
            attestation_target_hit_percentage: 90,
            attestation_hit_percentage: 95,
          }),
        },
        {
          id: 4,
          index: '3',
          data: JSON.stringify({
            attestation_target_hit_percentage: 90,
            attestation_hit_percentage: 95,
          }),
        },
      ]);

      const results = await controller.getValidatorMetricsById(1);
      expect(results).toEqual({
        hitEffectiveness: 97.5,
        targetEffectiveness: 95,
        totalEffectiveness: 96.25,
      });
    });
  });

  it('should fetch val graffiti', async () => {
    mockCacheManager.get.mockResolvedValueOnce(mockValCacheValues);

    const httpBeaconResponse: AxiosResponse = {
      data: { data: { 'fake-pub': 'mavrik' } },
    } as AxiosResponse;
    mockHttpService.request.mockReturnValueOnce(of(httpBeaconResponse));

    const result = await controller.fetchValidatorGraffiti('1');
    expect(result).toEqual({ data: 'mavrik' });
    expect(mockHttpService.request).toBeCalledWith({
      headers: { Authorization: 'Bearer mock-api-token' },
      method: 'GET',
      url: 'mock-url/lighthouse/ui/graffiti',
    });
  });
});
