import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { ActivityType } from '../../../src/types';
import { UpdateOptions, Op } from 'sequelize';
import { Response } from 'express';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity)
    private activityRepository: typeof Activity,
  ) {}

  private clients: Response[] = [];

  public addClient(client: Response) {
    this.clients.push(client);
  }

  public removeClient(client: Response) {
    this.clients = this.clients.filter((c) => c !== client);
  }

  public sendMessageToClients(data: any) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => client.write(message));
  }

  public async storeActivity(data: string, pubKey: string, type: ActivityType) {
    try {
      const result = await this.activityRepository.create({
        data,
        pubKey,
        type,
        hasSeen: false,
      });

      this.sendMessageToClients(result.dataValues);

      return { data: true };
    } catch (e) {
      return { data: false };
    }
  }

  public async fetchActivities(
    offset: string | undefined,
    limit: string | undefined,
    order: string | undefined,
    since: string | undefined,
  ) {
    let orderQuery = order?.toUpperCase();
    const queryLimit = limit ? Number(limit) : 10;

    if (orderQuery !== 'ASC' && orderQuery !== 'DESC') {
      orderQuery = 'DESC';
    }

    const whereClause = since
      ? {
          createdAt: {
            [Op.gt]: new Date(since),
          },
        }
      : undefined;

    if (whereClause) {
      return {
        count: await this.activityRepository.count(),
        rows: await this.activityRepository.findAll({
          where: whereClause,
          order: [['createdAt', orderQuery]],
        }),
      };
    }

    return this.activityRepository.findAndCountAll({
      limit: queryLimit === 0 ? undefined : queryLimit,
      offset: Number(offset) || 0,
      where: whereClause,
      order: [['createdAt', orderQuery]],
    });
  }

  public async updateHasSeen(id: string, status: boolean) {
    try {
      return await this.activityRepository.update({ hasSeen: status }, {
        where: { id },
      } as UpdateOptions);
    } catch (e) {
      throw e;
    }
  }
}
