// src/logs/logs.controller.ts
import { Controller, Get, Res, Req, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from './logs.service';
import { SessionGuard } from '../session.guard';
import { LogType } from '../../../src/types';

@Controller('logs')
@UseGuards(SessionGuard)
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get('validator')
  getValidatorLogs(@Res() res: Response, @Req() req: Request) {
    const validatorUrl = process.env.VALIDATOR_URL;
    this.logsService.getSseStream(req, res, `${validatorUrl}/lighthouse/logs`);
  }

  @Get('beacon')
  getBeaconLogs(@Res() res: Response, @Req() req: Request) {
    const beaconUrl = process.env.BEACON_URL;
    this.logsService.getSseStream(req, res, `${beaconUrl}/lighthouse/logs`);
  }

  @Get('priority')
  getPriorityLogs() {
    return this.logsService.readPriorityLogs()
  }

  @Get('priority/:page')
  getPriorityLogsPage(@Param('page') page: string) {
    return this.logsService.readPriorityLogs(page)
  }

  @Get('metrics')
  getLogMetrics() {
    return this.logsService.fetchLogCounts()
  }

  @Get('metrics/:type')
  getLogTypeMetrics(@Param('type') type: LogType) {
    return this.logsService.fetchLogCounts(type)
  }

  @Get('dismiss/:index')
  dismissLogAlert(@Param('index') index: string) {
    return this.logsService.dismissLog(index)
  }
}
