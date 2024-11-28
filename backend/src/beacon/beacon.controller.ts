import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { SessionGuard } from '../session.guard';
import { AuthGuard } from '../auth.guard';

@Controller('beacon')
@UseGuards(SessionGuard)
export class BeaconController {
  constructor(private beaconService: BeaconService) {}

  @Get('spec')
  async getBeaconSpec() {
    return this.beaconService.fetchSpecData();
  }

  @Get('version')
  async getBeaconNodeVersion() {
    return this.beaconService.fetchBeaconNodeVersion();
  }

  @Get('genesis')
  async getNodeGenesis() {
    return this.beaconService.fetchGenesisData();
  }

  @Get('sync')
  async getSyncData() {
    return this.beaconService.fetchSyncData();
  }

  @Get('inclusion')
  async getInclusionData() {
    return this.beaconService.fetchInclusionRate();
  }

  @Get('peer')
  async getPeerData() {
    return this.beaconService.fetchPeerData();
  }

  @Get('validator-count')
  async getValidatorCount() {
    return this.beaconService.fetchValidatorCount();
  }

  @Get('proposer-duties')
  async getProposerDuties() {
    return this.beaconService.fetchProposerDuties();
  }

  @Post('bls-execution')
  @UseGuards(AuthGuard)
  async executeBls(@Body() blsData) {
    return this.beaconService.executeBlsChange(blsData);
  }

  @Post('execute-exit')
  @UseGuards(AuthGuard)
  async executeVoluntaryExit(@Body() message) {
    return this.beaconService.submitSignedExit(message.data);
  }

  @Get('validator-status/:pubKey')
  async fetchValidatorStatus(@Param('pubKey') pubKey: string) {
    return this.beaconService.fetchValidatorStatus(pubKey);
  }
}
