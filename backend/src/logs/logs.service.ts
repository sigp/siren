import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Request, Response } from 'express';
import * as EventSource from 'eventsource';
import { LogLevels, LogType, SSELog } from '../../../src/types';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import { Op } from 'sequelize';
import { ClientManager } from '../utils/client-manager';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log)
    private logRepository: typeof Log,
  ) {}

  private isDebug = process.env.DEBUG === 'true';

  private logTypes = [LogType.BEACON, LogType.VALIDATOR];

  private sseStreams: Map<string, Subject<any>> = new Map();

  private clientManager = new ClientManager();

  public addClient(client: Response) {
    this.clientManager.addClient(client);
  }

  public removeClient(client: Response) {
    this.clientManager.removeClient(client);
  }

  public sendMessageToClients(data: any) {
    this.clientManager.sendMessageToClients(data);
  }

  public async startSse(url: string, type: LogType) {
    console.log(`starting sse ${url}, ${type}...`);
    const eventSource = new EventSource(url);

    const sseStream: Subject<any> = new Subject();
    this.sseStreams.set(url, sseStream);

    eventSource.onmessage = async (event) => {
      let newData;

      try {
        newData = JSON.parse(JSON.parse(event.data));
      } catch (e) {
        newData = JSON.parse(event.data) as SSELog;
      }

      const { level } = newData;

      if (level !== LogLevels.INFO) {
        const result = (await this.logRepository.create(
          { type, level, data: JSON.stringify(newData), isHidden: false },
          { ignoreDuplicates: true },
        )) as any;

        if (level === LogLevels.ERRO || level === LogLevels.CRIT) {
          this.sendMessageToClients(result.dataValues);
        }

        if (this.isDebug) {
          console.log(
            newData,
            type,
            '------------------------------------------ log --------------------------------------',
          );
        }
      }

      sseStream.next(event.data);
    };
  }

  public getSseStream(req: Request, res: Response, url: string) {
    const sseStream = this.sseStreams.get(url);
    if (sseStream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      res.flushHeaders();

      sseStream.subscribe((data) => {
        res.write(`data: ${data}\n\n`);
      });

      const heartbeatInterval = setInterval(() => {
        res.write(': keep-alive\n\n');
      }, 10000);

      req.on('close', () => {
        clearInterval(heartbeatInterval);
        res.end();
      });
    } else {
      console.error('SSE stream not found for URL:', url);
      res.status(404).end();
    }
  }

  async readLogMetrics(type?: LogType) {
    if (type && !this.logTypes.includes(type)) {
      throw new Error('Invalid log type');
    }

    const warnOptions = { where: { level: LogLevels.WARN } } as any;
    const errorOptions = { where: { level: LogLevels.ERRO } } as any;
    const critOptions = { where: { level: LogLevels.CRIT } } as any;

    if (type) {
      warnOptions.where.type = { [Op.eq]: type };
      errorOptions.where.type = { [Op.eq]: type };
      critOptions.where.type = { [Op.eq]: type };
    }

    const warningLogs = (await this.logRepository.findAll(warnOptions)).map(
      (data) => data.dataValues,
    );
    const errorLogs = (await this.logRepository.findAll(errorOptions)).map(
      (data) => data.dataValues,
    );
    const criticalLogs = (await this.logRepository.findAll(critOptions)).map(
      (data) => data.dataValues,
    );

    return {
      warningLogs,
      errorLogs,
      criticalLogs,
    };
  }

  async readMetrics(type?: LogType) {
    if (type && !this.logTypes.includes(type)) {
      throw new Error('Invalid log type');
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const warnOptions: any = {
      where: {
        level: LogLevels.WARN,
        createdAt: {
          [Op.gte]: oneHourAgo,
        },
      },
    };
    const errorOptions: any = {
      where: {
        level: LogLevels.ERRO,
        createdAt: {
          [Op.gte]: oneHourAgo,
        },
      },
    };
    const critOptions: any = {
      where: {
        level: LogLevels.CRIT,
        createdAt: {
          [Op.gte]: oneHourAgo,
        },
      },
    };

    if (type) {
      warnOptions.where.type = { [Op.eq]: type };
      errorOptions.where.type = { [Op.eq]: type };
      critOptions.where.type = { [Op.eq]: type };
    }

    const [warningCount, errorCount, criticalCount] = await Promise.all([
      this.logRepository.count(warnOptions),
      this.logRepository.count(errorOptions),
      this.logRepository.count(critOptions),
    ]);

    return {
      warningCount,
      errorCount,
      criticalCount,
    };
  }

  public async paginatedPriorityLogs(
    type?: LogType,
    order?: string | undefined,
    since?: string | undefined,
    limit?: string | undefined,
  ) {
    let orderQuery = order?.toUpperCase();
    const queryLimit = limit ? Number(limit) : 16;

    if (orderQuery !== 'ASC' && orderQuery !== 'DESC') {
      orderQuery = 'DESC';
    }

    // Build a single where object
    const whereClause: any = {};

    // If we have a 'since' timestamp, fetch only items older than that
    if (since) {
      whereClause.createdAt = {
        [Op.lt]: new Date(since),
      };
    }

    // If 'type' is provided, match that type
    if (type) {
      whereClause.type = type;
    }

    whereClause.level = { [Op.in]: [LogLevels.CRIT, LogLevels.ERRO] };
    whereClause.isHidden = false;

    return this.logRepository.findAll({
      limit: queryLimit === 0 ? undefined : queryLimit,
      where: whereClause,
      order: [['createdAt', orderQuery]],
    });
  }

  async dismissLog(id: string) {
    return await this.logRepository.update(
      { isHidden: true },
      { where: { id } },
    );
  }
}
