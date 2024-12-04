import { FC, SVGProps } from 'react'
import { Protocol } from '../constants/enums'
import { KeyStoreData } from '../hooks/useLodestarDepositData'
import { BeaconNodeSpecResults, SyncData } from './beacon'
import { Diagnostics } from './diagnostic'

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
  level: LogLevels
  type: LogType
  data: string
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

export type LogMetric = {
  warningLogs: LogData[]
  errorLogs: LogData[]
  criticalLogs: LogData[]
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
  WARNING = 'WARNING',
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

export enum ChainId {
  MAINNET = 'MAINNET',
  HOLESKY = 'HOLESKY',
  LOCALTESTNET = 'LOCALTESTNET',
}

export enum ValidatorManagementView {
  MAIN = 'MAIN',
  ADD = 'ADD',
  CREATE = 'CREATE',
  RECOVER = 'RECOVER',
  IMPORT = 'IMPORT',
}

export type AddValidatorOption = {
  title: string
  subTitle: string
  caption: string
  isDisabled: boolean
  isRecommended: boolean
  SVG: FC<SVGProps<SVGSVGElement>>
  view: ValidatorManagementView
}

export type ValidatorCandidate = {
  id: string
  index: number | undefined
  pubKey?: string
  name: string | undefined
  withdrawalCredentials: string | undefined
  keyStorePassword: string | undefined
  isValidIndex?: boolean
  isVerifiedCredentials?: boolean
}

export type ValidatorRewardEstimate = {
  apr: number
  totalAnnualRewards: number
}

export enum ActivityType {
  DEPOSIT = 'DEPOSIT',
  IMPORT = 'IMPORT',
  GRAFFITI = 'GRAFFITI',
  WITHDRAWAL = 'WITHDRAWAL',
}

export type ActivityResponse = {
  count: number
  rows: Activity[]
}

export type Activity = {
  type: ActivityType
  pubKey: string
  id: number
  data: string
  hasSeen: boolean
  createdAt: string
  updatedAt: string
}

export type TxStatus = 'pending' | 'error' | 'success'
export type TxHash = `0x${string}`

export type DepositData = {
  txHash: TxHash
  keyStore: KeyStoreData
  pubKey: string
  mnemonicIndex: number
  status: TxStatus
}

export enum TimeUnit {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
  HOUR = 'HOUR',
}

export enum NetworkId {
  HOLESKY = '17000',
  MAINNET = '1',
}
