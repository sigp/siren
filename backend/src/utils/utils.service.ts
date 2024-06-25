// utils.service.ts
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { StatusColor } from '../../../src/types';
import { DiagnosticRate } from '../../../src/constants/enums';
import { ModelCtor, Model } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BeaconNodeSpecResults } from '../../../src/types/beacon';

@Injectable()
export class UtilsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService
  ) {}

  private isDebug = process.env.DEBUG === 'true';

  getErrorMessage(code: string | number): string {
    if(code === 'ECONNREFUSED') {
      return 'Unable to connect to Beacon and Validator endpoints...'
    }

    if(code === 'NO_SESSION_PASSWORD') {
      return 'No session password, please update env configuration...'
    }

    if(code === 'NO_API_TOKEN') {
      return 'No api token found, please update env configuration...'
    }

    if(code === 'ERR_INVALID_URL') {
      return 'Invalid node url, please update env configuration...'
    }

    if(code === 403) {
      return 'Api token invalid, please update env configuration...'
    }

    return 'Unknown error...'
  }

  async getSlotInterval(): Promise<number> {
    const { SECONDS_PER_SLOT} = await this.cacheManager.get('specs') as BeaconNodeSpecResults
    return Number(SECONDS_PER_SLOT) * 1000
  }

  async getEpochInterval(offset: number): Promise<number> {
    const { SLOTS_PER_EPOCH, SECONDS_PER_SLOT} = await this.cacheManager.get('specs') as BeaconNodeSpecResults
    const secondsPerEpoch = (Number(SLOTS_PER_EPOCH) * Number(SECONDS_PER_SLOT))

    return (secondsPerEpoch + (offset || 0)) * 1000
  }

  async sendHttpRequest<T>(data: {
    url: string;
    method?: Method;
    config?: AxiosRequestConfig;
  }): Promise<AxiosResponse> {
    const { url, method = 'GET', config } = data;
    const observable$ = this.httpService.request({
      url,
      method,
      ...config,
    } as any);
    return firstValueFrom(observable$);
  }

  getHealthStatus(statuses: StatusColor[]): StatusColor {
    return statuses.includes(StatusColor.ERROR)
      ? StatusColor.ERROR
      : statuses.includes(StatusColor.WARNING)
        ? StatusColor.WARNING
        : StatusColor.SUCCESS;
  }

  getHealthCondition(status: StatusColor): DiagnosticRate {
    return status === StatusColor.ERROR
      ? DiagnosticRate.POOR
      : status === StatusColor.WARNING
        ? DiagnosticRate.FAIR
        : DiagnosticRate.GOOD;
  }

  async fetchFromCache(key: string, ttl: number, callback: () => any) {
    const cachedData = await this.cacheManager.get(key)

    if(cachedData) {
      if(this.isDebug) {
        console.log(`fetching from CACHE, key: ${key}....`)
      }
      return cachedData
    }

    const data = await callback()

    await this.cacheManager.set(key, data, ttl)

    if(this.isDebug) {
      console.log(`fetching from NODE, key: ${key} ......`)
    }

    return data
  }

  async fetchAll<T extends Model>(model: ModelCtor<T>, options?: FindOptions): Promise<T[]> {
    const data = await this.fetchDataWithRetry(() => model.findAll(options)) as T[]
    return data.map(item => item.dataValues)
  }

  async fetchDataWithRetry<T extends Model>(fetchFunction: () => Promise<T | T[] | null>, maxRetries: number = 3): Promise<T | T[] | null> {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        return await fetchFunction();
      } catch (error) {
        if (this.isLockError(error)) {
          attempts++;
          await this.wait(this.getExponentialBackoffTime(attempts));
        } else {
          throw new HttpException('Database Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }
    throw new HttpException('Request timed out due to database lock, please retry later.', HttpStatus.REQUEST_TIMEOUT);
  }

  private isLockError(error: any): boolean {
    return error.message.includes('lock') || error.name === 'SequelizeDatabaseError';
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getExponentialBackoffTime(attempt: number): number {
    return Math.pow(2, attempt) * 100;  // Base time is 100 ms
  }
}
