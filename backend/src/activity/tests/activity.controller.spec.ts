import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from '../activity.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Activity } from '../entities/activity.entity';
import { ActivityService } from '../activity.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { Sequelize } from 'sequelize-typescript';
import { JwtModule } from '@nestjs/jwt';
import { ActivityType } from '../../../../src/types';

describe('ActivityController', () => {
  const baseRowData = {
    createdAt: new Date('2024-11-05T18:46:47.679Z'),
    updatedAt: new Date('2024-11-05T18:46:47.679Z'),
  };

  const data = [
    {
      ...baseRowData,
      id: 1,
      type: ActivityType.IMPORT,
      pubKey: 'mock-pub-key',
      data: 'mock-data',
      hasSeen: false,
    },
    {
      ...baseRowData,
      id: 2,
      type: ActivityType.DEPOSIT,
      pubKey: 'mock-pub-key',
      data: 'mock-data',
      hasSeen: false,
    },
    {
      ...baseRowData,
      id: 3,
      type: ActivityType.GRAFFITI,
      pubKey: 'mock-pub-key',
      data: 'mock-data',
      hasSeen: false,
      createdAt: new Date('2024-11-05T18:56:47.679Z'),
    },
  ];

  let controller: ActivityController;
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
        SequelizeModule.forFeature([Activity]),
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
      providers: [ActivityService],
      controllers: [ActivityController],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    controller = module.get<ActivityController>(ActivityController);
    sequelize = module.get<Sequelize>(Sequelize);

    await Activity.bulkCreate(data);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getActivities', () => {
    it('should return count and row data', async () => {
      const results = await controller.getActivities();
      const plainRows = results.rows.map((row) => row.toJSON());
      expect(results.count).toBe(3);
      expect(plainRows).toEqual(expect.arrayContaining(data));
    });
    it('should return limited data', async () => {
      const results = await controller.getActivities(undefined, '1');
      expect(results.rows.length).toBe(1);
    });

    it('should return correct rows when offset', async () => {
      const results = await controller.getActivities('1');
      const plainRows = results.rows.map((row) => row.toJSON());

      expect(plainRows[0].type).toBe(ActivityType.IMPORT);
    });
    it('should return data in correct order', async () => {
      const results = await controller.getActivities(
        undefined,
        undefined,
        'ASC',
      );
      const plainRows = results.rows.map((row) => row.toJSON());

      expect(plainRows[0].type).toBe(ActivityType.IMPORT);
    });
    it('should filter new data by timestamp', async () => {
      const results = await controller.getActivities(
        undefined,
        undefined,
        undefined,
        '2024-11-05T18:46:47.679Z',
      );
      const plainRows = results.rows.map((row) => row.toJSON());

      expect(plainRows).toEqual(data.filter((item) => item.id === 3));
    });
  });
});
