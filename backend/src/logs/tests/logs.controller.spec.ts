import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from '../logs.controller';
import { LogsService } from '../logs.service';
import { UtilsModule } from '../../utils/utils.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from '../entities/log.entity';
import { Sequelize } from 'sequelize-typescript';
import { mockCritLog, mockErrorLog, mockWarningLog } from '../../../../src/mocks/logs';
import { LogType } from '../../../../src/types';

describe('LogsController', () => {
  let logsService: LogsService;
  let controller: LogsController;
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UtilsModule,
        SequelizeModule.forFeature([Log]),
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          autoLoadModels: true,
          synchronize: true,
        }),
        JwtModule.register({
          global: true,
          secret: 'fake-value',
          signOptions: { expiresIn: '7200s' }, // set to 2 hours
        }),
      ],
      providers: [LogsService],
      controllers: [LogsController],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    controller = module.get<LogsController>(LogsController);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    httpService = module.get<HttpService>(HttpService);
    logsService = module.get<LogsService>(LogsService);
    sequelize = module.get<Sequelize>(Sequelize);

    mockCacheManager.get.mockResolvedValue(null);

    await Log.bulkCreate([
      mockWarningLog,
      mockErrorLog,
      mockCritLog,
    ]);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should return log metrics', async () => {
    const data = {
      warningLogs: 1,
      errorLogs: 1,
      criticalLogs: 1,
    };

    const result = await controller.getLogMetrics();
    expect(result).toEqual(data);
  });

  it('should return validator log metrics', async () => {
    const data = {
      warningLogs: 0,
      errorLogs: 0,
      criticalLogs: 1,
    };

    const result = await controller.getLogTypeMetrics(LogType.VALIDATOR);
    expect(result).toEqual(data);
  });

  it('should return beacon log metrics', async () => {
    const data = {
      warningLogs: 1,
      errorLogs: 1,
      criticalLogs: 0,
    };

    const result = await controller.getLogTypeMetrics(LogType.BEACON);
    expect(result).toEqual(data);
  });

  it('should return priority logs', async () => {
    const result = await controller.getPriorityLogs()

    expect(result).toEqual({logs: [mockErrorLog, mockCritLog], hasNextPage: false})
  })

  it('should update log metrics', async () => {
    const result = await controller.dismissLogAlert('1');
    expect(result).toEqual([1]);
  });
});
