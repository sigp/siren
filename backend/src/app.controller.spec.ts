import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    jest.resetModules()
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'fake-value',
          signOptions: { expiresIn: '7200s' }, //set to  2 hours
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root auth', () => {
    it('should reject no passwords', async () => {
      process.env.SESSION_PASSWORD = undefined
      await expect(appController.authenticate({password: 'adsf'})).rejects.toThrow(new UnauthorizedException('authPrompt.noPasswordFound'));
    });
    it('should reject invalid passwords', async () => {
      await expect(appController.authenticate({password: 'adsf'})).rejects.toThrow(new UnauthorizedException('authPrompt.invalidPassword'));
    });
    it('should return valid session tokens', async () => {
      expect(await appController.authenticate({password: process.env.SESSION_PASSWORD})).toMatchObject({ access_token: expect.any(String) });
    });
  });
});
