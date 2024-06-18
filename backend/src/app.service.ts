import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {
  }
  private sessionPassword = process.env.SESSION_PASSWORD;

  async authenticateSessionPassword(password: string) {
    if(!this.sessionPassword) {
      throw new Error('authPrompt.noPasswordFound')
    }

    if(password !== this.sessionPassword) {
      throw new UnauthorizedException('authPrompt.invalidPassword')
    }

    const payload = {sub: 'authenticated_session'}

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
