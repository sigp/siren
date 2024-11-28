import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { SessionGuard } from '../session.guard';
import { Request, Response } from 'express';

@Controller('activity')
@UseGuards(SessionGuard)
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get('/')
  async getActivities(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: string,
    @Query('since') since?: string,
  ) {
    return this.activityService.fetchActivities(offset, limit, order, since);
  }

  @Post('/')
  async logActivity(@Body() activity) {
    const { data, pubKey, type } = activity;
    return this.activityService.storeActivity(data, pubKey, type);
  }

  @Put(':id/read')
  async markAsSeen(@Param('id') id: string) {
    return this.activityService.updateHasSeen(id, true);
  }

  @Get('stream')
  sse(@Req() req: Request, @Res() res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.flushHeaders();

    this.activityService.addClient(res);

    const heartbeatInterval = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 10000);

    req.on('close', () => {
      clearInterval(heartbeatInterval);
      this.activityService.removeClient(res);
      res.end();
    });
  }
}
