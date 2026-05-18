import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { UtilsModule } from '../../utils/utils.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { ValidatorService } from '../validator.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { SequelizeModule } from '@nestjs/sequelize';
import { Metric } from '../entities/metric.entity';
import { ValidatorAlias } from '../entities/validator-alias.entity';
import { Sequelize } from 'sequelize-typescript';
import { ActivityModule } from '../../activity/activity.module';
import { AuthModule } from '../../auth.module';

describe('ValidatorService (network profile)', () => {
  let service: ValidatorService;
  let sequelize: Sequelize;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockHttpService = {
    request: jest.fn(),
  };

  const stateBatch = [
    {
      index: '1',
      balance: '32000000000',
      status: 'active_ongoing',
      validator: {
        activation_epoch: '1',
        effective_balance: '32000000000',
        pubkey: 'mock-pubkey',
        slashed: false,
        withdrawal_credentials: 'mock-creds',
      },
    },
  ];

  const queueMocksForConfig = (configName: string) => {
    mockCacheManager.get
      .mockResolvedValueOnce({ SECONDS_PER_SLOT: '12' }) // getSlotInterval
      .mockResolvedValueOnce(null) // valStates cache miss
      .mockResolvedValueOnce({
        SECONDS_PER_SLOT: '12',
        CONFIG_NAME: configName,
      }) // getCachedNetworkProfile
      .mockResolvedValueOnce([
        {
          index: '1',
          pubkey: 'mock-pubkey',
          status: 'active_ongoing',
          withdrawal_credentials: 'fake-creds',
        },
      ]); // validators

    mockHttpService.request.mockReturnValueOnce(
      of({ data: { data: stateBatch } } as AxiosResponse),
    );
    // fee recipient request — return empty so the .catch fallback fires
    mockHttpService.request.mockReturnValueOnce(
      of({ data: { data: { ethaddress: '' } } } as AxiosResponse),
    );
  };

  beforeEach(async () => {
    process.env.VALIDATOR_URL = 'mock-url';
    process.env.API_TOKEN = 'mock-api-token';
    process.env.BEACON_URL = 'mock-beacon';

    mockCacheManager.get.mockReset();
    mockHttpService.request.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UtilsModule,
        ActivityModule,
        CacheModule.register(),
        AuthModule,
        SequelizeModule.forFeature([Metric, ValidatorAlias]),
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
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    service = module.get<ValidatorService>(ValidatorService);
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('returns effective balance of 32 for mainnet (gweiDivisor = 1)', async () => {
    queueMocksForConfig('mainnet');
    const result = await service.fetchValidatorStates();
    expect(result[0].effectiveBalance).toBe(32);
    expect(result[0].balance).toBe(32);
    expect(result[0].rewards).toBe(0);
  });

  it('returns effective balance of 1 for gnosis (gweiDivisor = 32)', async () => {
    queueMocksForConfig('gnosis');
    const result = await service.fetchValidatorStates();
    expect(result[0].effectiveBalance).toBe(1);
    expect(result[0].balance).toBe(1);
    expect(result[0].rewards).toBe(0);
  });
});
