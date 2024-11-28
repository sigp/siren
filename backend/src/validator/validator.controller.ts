import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { SessionGuard } from '../session.guard';
import { AuthGuard } from '../auth.guard';

@Controller('validator')
@UseGuards(SessionGuard)
export class ValidatorController {
  constructor(private validatorService: ValidatorService) {}

  @Get('auth-key')
  async getValidatorAuth() {
    return this.validatorService.fetchValidatorAuthKey();
  }

  @Get('version')
  async getValidatorVersion() {
    return this.validatorService.fetchValidatorVersion();
  }

  @Get('states')
  async getValidatorStates() {
    return this.validatorService.fetchValidatorStates();
  }

  @Get('caches')
  async getValidatorCaches() {
    return this.validatorService.fetchValidatorCaches();
  }

  @Get('metrics')
  async getValidatorMetrics() {
    return this.validatorService.fetchMetrics();
  }

  @Get('metrics/:index')
  async getValidatorMetricsById(@Param('index') index: number) {
    return this.validatorService.fetchMetrics(index);
  }

  @Get('graffiti/:index')
  async fetchValidatorGraffiti(@Param('index') index: string) {
    return this.validatorService.fetchGraffiti(index);
  }

  @Put('graffiti')
  @UseGuards(AuthGuard)
  async updateValidatorGraffiti(@Body() graffitiData) {
    return this.validatorService.updateGraffiti(graffitiData);
  }

  @Post('sign-exit')
  @UseGuards(AuthGuard)
  async signVoluntaryExit(@Body() signData) {
    return this.validatorService.signVoluntaryExit(signData.pubKey);
  }

  @Post('import-keystore')
  async importValKeystore(@Body() keystoreData) {
    return this.validatorService.importValidatorKeystore(keystoreData.data);
  }
}
