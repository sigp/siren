import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Request, Response } from 'express';
import * as EventSource from 'eventsource';
import { LogLevels, LogType, SSELog } from '../../../src/types';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import { Op } from 'sequelize';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log)
    private logRepository: typeof Log,
  ) {}

  private isDebug = process.env.DEBUG === 'true';

  private logTypes = [LogType.BEACON, LogType.VALIDATOR];

  private sseStreams: Map<string, Subject<any>> = new Map();

  public async startSse(url: string, type: LogType) {
    console.log(`starting sse ${url}, ${type}...`);
    const eventSource = new EventSource(url);

    const sseStream: Subject<any> = new Subject();
    this.sseStreams.set(url, sseStream);

    eventSource.onmessage = (event) => {
      let newData;

      try {
        newData = JSON.parse(JSON.parse(event.data));
      } catch (e) {
        newData = JSON.parse(event.data) as SSELog;
      }

      const { level } = newData;

      if (level !== LogLevels.INFO) {
        this.logRepository.create(
          { type, level, data: JSON.stringify(newData), isHidden: false },
          { ignoreDuplicates: true },
        );
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

    let warnOptions = { where: { level: LogLevels.WARN } } as any;
    let errorOptions = { where: { level: LogLevels.ERRO } } as any;
    let critOptions = { where: { level: LogLevels.CRIT } } as any;

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

  async dismissLog(id: string) {
    return await this.logRepository.update(
      { isHidden: true },
      { where: { id } },
    );
  }
}
