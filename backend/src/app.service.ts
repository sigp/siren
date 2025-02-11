import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  private sessionPassword = process.env.SESSION_PASSWORD;

  async invalidateToken(token: string) {
    const decoded = this.jwtService.decode(token) as any;
    if (!decoded || !decoded.exp || !decoded.jti) {
      throw new UnauthorizedException('Invalid token');
    }

    const expiresIn = decoded.exp * 1000 - Date.now();

    if (expiresIn <= 0) {
      return { message: 'Token is already expired' };
    }

    await this.cacheManager.set(
      `blacklist:${decoded.jti}`,
      'blacklisted',
      expiresIn,
    );

    return { message: 'Token invalidated' };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const decoded = this.jwtService.decode(token) as any;
    if (!decoded || !decoded.jti) {
      return false;
    }

    const result = await this.cacheManager.get(`blacklist:${decoded.jti}`);
    return result === 'blacklisted';
  }

  async authenticateSessionPassword(password: string) {
    if (!this.sessionPassword) {
      throw new Error('authPrompt.noPasswordFound');
    }

    if (password !== this.sessionPassword) {
      throw new UnauthorizedException('authPrompt.invalidPassword');
    }

    const jti = uuidV4().toString();
    const payload = { sub: 'authenticated_session', jti };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
