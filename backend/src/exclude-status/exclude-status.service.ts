import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExcludeStatus } from './entities/exclude-status.entity';
import { ValidatorStatus } from '../../../src/types/validator';

@Injectable()
export class ExcludeStatusService {
  constructor(
    @InjectModel(ExcludeStatus)
    private excludeStatusRepository: typeof ExcludeStatus,
  ) {}

  public async fetchExclusions() {
    return this.excludeStatusRepository.findAll();
  }

  public async deleteExclusion(id: string) {
    await this.excludeStatusRepository.destroy({ where: { id } });
    return this.fetchExclusions();
  }

  public async createExclusion(status: ValidatorStatus) {
    await this.excludeStatusRepository.create({ status });
    return this.fetchExclusions();
  }
}
