import { Controller, Get, Res, Req, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from './logs.service';
import { SessionGuard } from '../session.guard';
import { KEEP_ALIVE_MESSAGE, SSE_HEADER } from '../../../src/constants/sse';

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

  @Get('metrics')
  getLogMetrics() {
    return this.logsService.readLogMetrics();
  }

  @Get('priority-log-stream')
  sse(@Req() req: Request, @Res() res: Response) {
    res.writeHead(200, SSE_HEADER);

    res.flushHeaders();

    this.logsService.addClient(res);

    const heartbeatInterval = setInterval(() => {
      res.write(KEEP_ALIVE_MESSAGE);
    }, 10000);

    req.on('close', () => {
      clearInterval(heartbeatInterval);
      this.logsService.removeClient(res);
      res.end();
    });
  }

  @Get('dismiss/:index')
  dismissLogAlert(@Param('index') index: string) {
    return this.logsService.dismissLog(index);
  }
}
