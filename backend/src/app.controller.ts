import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @Post('authenticate')
  authenticate(@Body() data: Record<string, any>) {
    return this.appService.authenticateSessionPassword(data.password);
  }
}
