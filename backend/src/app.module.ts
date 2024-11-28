import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeaconModule } from './beacon/beacon.module';
import { ConfigModule } from '@nestjs/config';
import { ValidatorModule } from './validator/validator.module';
import { NodeModule } from './node/node.module';
import { LogsModule } from './logs/logs.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { JwtModule } from '@nestjs/jwt';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    SequelizeModule.forRoot(dataBaseConfig),
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.API_TOKEN,
      signOptions: { expiresIn: '7200s' }, //set to  2 hours
    }),
    ScheduleModule.forRoot(),
    LogsModule,
    TasksModule,
    BeaconModule,
    ValidatorModule,
    NodeModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
