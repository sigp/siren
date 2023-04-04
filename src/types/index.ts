import { RecoilState } from 'recoil'
import { Protocol } from '../constants/enums'
import { Method } from 'axios'

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

export type ApiPollConfig = {
  time: number
  isReady: boolean
  intervalState: RecoilState<NodeJS.Timer | undefined>
  url?: string
  apiToken?: string
  maxErrors?: number
  onMaxError?: () => void
  params?: { [key: string]: any }
  data?: { [key: string]: any }
  method?: Method
}

export type Endpoint = {
  protocol: Protocol
  address: string
  port: number
}

export type Alert = {
  message: string
  subText: string
  severity: StatusColor
}

export type CurrencyPrefix = {
  prefix: string
  formattedPrefix?: string
}

export type PollingIntervalOptions = {
  isSkip: boolean
  onClearInterval?: () => void
}

export type PollingInterval = {
  intervalId: NodeJS.Timer | undefined
  clearPoll: (id: NodeJS.Timer) => void
}

export type SemanticVersion = {
  major: number
  minor: number
  patch: number
}

export type SessionAuthStorage = {
  password: string
  delay: number
}
