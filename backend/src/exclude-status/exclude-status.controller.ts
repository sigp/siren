import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExcludeStatusService } from './exclude-status.service';
import { SessionGuard } from '../session.guard';
import { ValidatorStatus } from '../../../src/types/validator';

@Controller('exclude-status')
@UseGuards(SessionGuard)
export class ExcludeStatusController {
  constructor(private excludeStatusService: ExcludeStatusService) {}

  @Get('')
  async getExclusions() {
    return await this.excludeStatusService.fetchExclusions();
  }

  @Delete('/:id')
  async removeExclusion(@Param('id') id: string) {
    return await this.excludeStatusService.deleteExclusion(id);
  }

  @Post('')
  async postExclusion(@Body() data) {
    const { status } = data;
    return await this.excludeStatusService.createExclusion(
      status as ValidatorStatus,
    );
  }
}
