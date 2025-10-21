import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Request, Response } from 'express';
import * as EventSource from 'eventsource';
import { LogLevels, LogType, SSELog, LighthouseLog } from '../../../src/types';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import { Op } from 'sequelize';
import { ClientManager } from '../utils/client-manager';
import { LOG_FETCH_LIMIT } from '../../../src/constants/constants';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log)
    private logRepository: typeof Log,
  ) {}

  private isDebug = process.env.DEBUG === 'true';

  private logTypes = [LogType.BEACON, LogType.VALIDATOR];

  private sseStreams: Map<string, Subject<any>> = new Map();

  private eventSources: Map<string, EventSource> = new Map();

  private clientManager = new ClientManager();

  /**
   * Transforms the new Lighthouse log format to the expected SSELog format
   */
  private transformLighthouseLog(rawLog: LighthouseLog): SSELog {
    const { fields, level, target, time } = rawLog;
    const { message, ...otherFields } = fields;

    return {
      level,
      msg: message,
      service: target,
      time,
      ...otherFields,
    };
  }

  /**
   * Determines if log data is in the new Lighthouse format
   */
  private isLighthouseFormat(data: any): data is LighthouseLog {
    return (
      typeof data === 'object' &&
      data !== null &&
      'fields' in data &&
      'level' in data &&
      'target' in data &&
      'time' in data &&
      typeof data.fields === 'object' &&
      'message' in data.fields
    );
  }

  public addClient(client: Response) {
    this.clientManager.addClient(client);
  }

  public removeClient(client: Response) {
    this.clientManager.removeClient(client);
  }

  public sendMessageToClients(data: any) {
    this.clientManager.sendMessageToClients(data);
  }

  public async startSse(url: string, type: LogType): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`starting sse ${url}, ${type}...`);
      
      try {
        const eventSource = new EventSource(url);

        const sseStream: Subject<any> = new Subject();
        this.sseStreams.set(url, sseStream);

        // Store the EventSource for cleanup
        this.eventSources.set(url, eventSource);

        let isConnected = false;

        eventSource.onopen = () => {
          console.log(`SSE connection opened for ${type}: ${url}`);
          isConnected = true;
          resolve();
        };

        eventSource.onerror = (error) => {
          console.error(`SSE connection error for ${type}: ${url}`, error);
          
          // Clean up on error
          eventSource.close();
          this.sseStreams.delete(url);
          this.eventSources.delete(url);
          
          if (!isConnected) {
            // If we haven't connected yet, reject the promise
            reject(new Error(`Failed to establish SSE connection to ${url}: ${error}`));
          } else {
            // If we were connected and lost connection, just log it
            console.log(`SSE connection lost for ${type}, will retry on next connection attempt`);
          }
        };

        eventSource.onmessage = async (event) => {
          try {
            let rawData;
            let newData: SSELog;

            try {
              rawData = JSON.parse(JSON.parse(event.data));
            } catch (e) {
              try {
                rawData = JSON.parse(event.data);
              } catch (parseError) {
                console.error(`Failed to parse SSE data for ${type}:`, parseError);
                return;
              }
            }

            // Transform new Lighthouse format to expected SSELog format
            if (this.isLighthouseFormat(rawData)) {
              newData = this.transformLighthouseLog(rawData);
            } else {
              // Handle legacy format
              newData = rawData as SSELog;
            }

            const { level } = newData;

            if (level !== LogLevels.DEBUG) {
              try {
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
              } catch (dbError) {
                console.error(`Database error saving log for ${type}:`, dbError);
              }
            }

            sseStream.next(event.data);
          } catch (messageError) {
            console.error(`Error processing SSE message for ${type}:`, messageError);
          }
        };

        // Set a timeout for initial connection
        setTimeout(() => {
          if (!isConnected) {
            console.error(`SSE connection timeout for ${type}: ${url}`);
            eventSource.close();
            this.sseStreams.delete(url);
            this.eventSources.delete(url);
            reject(new Error(`SSE connection timeout for ${url}`));
          }
        }, 10000); // 10 second timeout

      } catch (setupError) {
        console.error(`Error setting up SSE for ${type}:`, setupError);
        reject(setupError);
      }
    });
  }

  public closeAllSseConnections(): void {
    console.log('Closing all SSE connections...');
    
    this.eventSources.forEach((eventSource, url) => {
      try {
        eventSource.close();
        console.log(`Closed SSE connection: ${url}`);
      } catch (error) {
        console.error(`Error closing SSE connection ${url}:`, error);
      }
    });
    
    this.eventSources.clear();
    this.sseStreams.clear();
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

  async readLogData(
    type?: LogType | undefined,
    limit?: string | undefined,
    offset?: string | undefined,
    level?: LogLevels | undefined,
  ): Promise<Log[]> {
    if (type && !this.logTypes.includes(type)) {
      throw new Error('Invalid log type');
    }

    const queryLimit = limit ? Number(limit) : LOG_FETCH_LIMIT;

    const options: any = {
      where: { type },
      offset: Number(offset) || 0,
      limit: queryLimit === 0 ? undefined : queryLimit,
      order: [['createdAt', 'DESC']],
    };

    if (level) {
      options.where.level = level;
    }

    const logs = await this.logRepository.findAll(options);

    return logs.reverse();
  }

  async searchLogs(type: LogType, search?: string): Promise<Log[]> {
    if (!this.logTypes.includes(type)) {
      throw new Error('Invalid log type');
    }

    if (!search) {
      throw new Error('No search text provided');
    }

    return await this.logRepository.findAll({
      where: {
        type,
        data: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', 'ASC']],
    });
  }
}
