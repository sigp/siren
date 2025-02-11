import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.API_TOKEN,
      signOptions: { expiresIn: '7200s' },
    }),
    CacheModule.register(),
  ],
  providers: [AppService],
  exports: [AppService],
})
export class AuthModule {}
