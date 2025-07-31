import {
  Body,
  Controller,
  Delete,
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

  @Get('partial-withdrawals')
  async getPartialWithdrawals() {
    return this.validatorService.fetchPartialWithdrawals();
  }

  @Get('pending-deposits')
  async getPendingDeposits() {
    return this.validatorService.fetchPendingDeposits();
  }

  @Get('aliases')
  async getValidatorAliases() {
    return this.validatorService.fetchValidatorAliases();
  }

  @Put('aliases/:index')
  async updateValidatorAlias(
    @Param('index') index: string,
    @Body('alias') alias: string,
  ) {
    const validatorIndex = parseInt(index, 10);
    if (isNaN(validatorIndex)) {
      throw new Error('Invalid validator index');
    }
    return this.validatorService.createOrUpdateValidatorAlias(
      validatorIndex,
      alias,
    );
  }

  @Delete('aliases/:index')
  async deleteValidatorAlias(@Param('index') index: string) {
    const validatorIndex = parseInt(index, 10);
    if (isNaN(validatorIndex)) {
      throw new Error('Invalid validator index');
    }
    await this.validatorService.deleteValidatorAlias(validatorIndex);
    return { success: true };
  }

  @Post('aliases/import')
  async importValidatorAliases(
    @Body('aliases') aliases: Record<string, string>,
  ) {
    await this.validatorService.importValidatorAliases(aliases);
    return { success: true };
  }
}
