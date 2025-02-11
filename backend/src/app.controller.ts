import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SessionGuard } from './session.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @Post('authenticate')
  authenticate(@Body() data: Record<string, any>) {
    return this.appService.authenticateSessionPassword(data.password);
  }

  @Post('/logout')
  @UseGuards(SessionGuard)
  async logoutSession(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new Error('No Authorization header');
    }
    const token = authHeader.split(' ')[1];
    return await this.appService.invalidateToken(token);
  }
}
