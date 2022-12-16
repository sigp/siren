import { RecoilState } from 'recoil'
import { Protocol } from '../constants/enums'

export type StatusType = 'bg-success' | 'bg-warning' | 'bg-error'

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
}

export type Endpoint = {
  protocol: Protocol
  address: string
  port: number
}

export type Alert = {
  message: string
  subText: string
  severity: StatusType
}

export type CurrencyPrefix = {
  prefix: string
  formattedPrefix?: string
}

export type DeviceInfo = {
  beaconNode: Endpoint
  validatorClient: Endpoint
  apiToken: string
  deviceName: string
}
