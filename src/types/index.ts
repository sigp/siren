import { Protocol } from '../constants/enums'
import { BeaconNodeSpecResults, SyncData } from './beacon'
import {
  Diagnostics,
} from './diagnostic'

export interface NextFetchRequestInit extends RequestInit {
  next?: {
    revalidate?: number
  }
}

export enum StatusColor {
  DARK = 'bg-dark100',
  SUCCESS = 'bg-success',
  WARNING = 'bg-warning',
  ERROR = 'bg-error',
}

export type ClientProvider = {
  provider: string
  title: string
  cardNumber: string
  subTitle: string
  language: string
}

export type NodeVersion = {
  version: string
  id: string
}

export type Endpoint = {
  protocol: Protocol
  address: string
  port: number
}

export type SemanticVersion = {
  major: number
  minor: number
  patch: number
}

export type LogData = {
  id: number
  level: LogLevels,
  type: LogType,
  data: string
  isHidden: boolean,
  createdAt: string
  updatedAt: string
}

export type LogMetric = {
  warningLogs: number,
  errorLogs: number,
  criticalLogs: number,
}

export type PriorityLogResults = {
  logs: LogData[],
  hasNextPage: boolean
}

export enum LogType {
  VALIDATOR = 'VALIDATOR',
  BEACON = 'BEACON',
}

export enum LogLevels {
  CRIT = 'CRIT',
  ERRO = 'ERRO',
  WARN = 'WARN',
  INFO = 'INFO',
}

export type SSELog = {
  error: string
  level: LogLevels
  msg: string
  service: string
  time: string
  [key: string]: any
}

export interface DeviceList {
  [key: string]: DeviceSettings
}

export interface DeviceSettings {
  rawValidatorUrl: string
  validatorUrl: string
  beaconUrl: string
  apiToken?: string
  deviceName: string
}

export type ActiveDevice = Required<DeviceSettings>

export interface ValAliases {
  [key: string]: string
}

export interface AlertMessage {
  severity: StatusColor
  message: string
  subText: string
  id: string
  isDismissed?: boolean
}

export enum ToastType {
  ERROR = 'error',
  SUCCESS = 'success',
}

export type Rates = {
  [currency: string]: number
}

export type EthExchangeRates = {
  rates: Rates
  currencies: string[]
}

export type ProposerDuty = {
  pubkey: string
  validator_index: string
  slot: string
  uuid: string
}

export type OptionalString = string | undefined
export type OptionalBoolean = boolean | undefined

export interface SetupProps {
  beaconSpec: BeaconNodeSpecResults
  initNodeHealth: Diagnostics
  initSyncData: SyncData
}
