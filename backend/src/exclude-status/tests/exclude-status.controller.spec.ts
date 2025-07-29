import { Test, TestingModule } from '@nestjs/testing';
import { ExcludeStatusController } from '../exclude-status.controller';
import { Sequelize } from 'sequelize-typescript';
import { AuthModule } from '../../auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ExcludeStatus } from '../entities/exclude-status.entity';
import { ExcludeStatusService } from '../exclude-status.service';

describe('ExcludeStatusController', () => {
  const baseRowData = {
    createdAt: new Date('2024-11-05T18:46:47.679Z'),
    updatedAt: new Date('2024-11-05T18:46:47.679Z'),
  };

  const data = [
    {
      ...baseRowData,
      status: 'withdrawal_done',
    },
    {
      ...baseRowData,
      status: 'deposit',
    },
  ];
  let controller: ExcludeStatusController;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        SequelizeModule.forFeature([ExcludeStatus]),
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
      providers: [ExcludeStatusService],
      controllers: [ExcludeStatusController],
    }).compile();

    controller = module.get<ExcludeStatusController>(ExcludeStatusController);
    sequelize = module.get<Sequelize>(Sequelize);
    await ExcludeStatus.bulkCreate(data);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all exclusions', async () => {
    const results = await controller.getExclusions();
    expect(results.length).toBe(2);
  });

  it('should create new exclusions', async () => {
    const results = await controller.postExclusion({ status: 'active' });
    expect(results.length).toBe(3);
  });

  it('should delete exclusions', async () => {
    const results = await controller.removeExclusion('1');
    expect(results.length).toBe(1);
    expect(results[0].status).toBe('deposit');
  });
});
