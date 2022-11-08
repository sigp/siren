import { FunctionComponent, SVGProps } from 'react'

import { ReactComponent as DashLogo } from '../assets/images/dashboard.svg'
import { ReactComponent as ValidatorLogo } from '../assets/images/validators.svg'
import { ReactComponent as LogsLogo } from '../assets/images/logs.svg'
import { ReactComponent as GrafanaLogo } from '../assets/images/grafana.svg'
import { ReactComponent as SettingsLogo } from '../assets/images/settings.svg'
import { ContentView } from './enums'
import { EarningOption, ValidatorStatus } from '../types/validator'
import { ClientProvider } from '../types'

export type ViewType = {
  title: string
  logoComponent: FunctionComponent<SVGProps<SVGSVGElement>>
  key: ContentView
}

export const VIEW = {
  DASH: {
    title: 'sidebar.dashboard',
    logoComponent: DashLogo,
    key: ContentView.MAIN,
  },
  VALIDATORS: {
    title: 'sidebar.validatorManagement',
    logoComponent: ValidatorLogo,
    key: ContentView.VALIDATORS,
  },
  LOGS: {
    title: 'sidebar.logs',
    logoComponent: LogsLogo,
    key: ContentView.LOGS,
  },
  GRAFANA: {
    title: 'sidebar.grafana',
    logoComponent: GrafanaLogo,
    key: ContentView.GRAFANA,
  },
  SETTINGS: {
    title: 'sidebar.settings',
    logoComponent: SettingsLogo,
    key: ContentView.SETTINGS,
  },
}

export const PRIMARY_VIEWS = [VIEW.DASH, VIEW.VALIDATORS, VIEW.LOGS, VIEW.GRAFANA] as ViewType[]
export const SECONDARY_VIEWS = [VIEW.SETTINGS] as ViewType[]

export const FAKE_VALIDATORS = [
  {
    index: '1',
    pubKey: '0xb9d94c35',
    balance: 32.0963,
    slashed: false,
    rewards: 0.0963,
    processed: 1,
    missed: 0,
    attested: 768,
    aggregated: 560,
    status: 'unknown' as ValidatorStatus,
  },
  {
    index: '2',
    pubKey: '0xb9da2c35',
    balance: 2.0963,
    rewards: 1.0963,
    slashed: false,
    processed: 2,
    missed: 1,
    attested: 450,
    aggregated: 160,
    status: 'queue' as ValidatorStatus,
  },
  {
    index: '3',
    pubKey: '0xb9da2c35',
    balance: 25.0963,
    rewards: 1.0963,
    slashed: false,
    processed: 2,
    missed: 1,
    attested: 450,
    aggregated: 160,
    status: 'active-slash' as ValidatorStatus,
  },
  {
    index: '4',
    pubKey: '0xb9da2c35',
    balance: 22.0963,
    rewards: 1.0963,
    slashed: false,
    processed: 2,
    missed: 1,
    attested: 450,
    aggregated: 160,
    status: 'active' as ValidatorStatus,
  },
  {
    index: '5',
    pubKey: '0xb9da2c35',
    balance: 12.0963,
    rewards: 1.0963,
    slashed: false,
    processed: 2,
    missed: 1,
    attested: 450,
    aggregated: 160,
    status: 'unknown' as ValidatorStatus,
  },
]

export const BALANCE_COLORS = [
  'rgba(94, 65, 213, 1)',
  'rgba(213, 65, 184, 1)',
  'rgba(168, 65, 213, 1)',
  'rgba(94, 65, 213, .6)',
  'rgba(213, 65, 184, .6)',
  'rgba(168, 65, 213, .6)',
  'rgba(94, 65, 213, .3)',
  'rgba(213, 65, 184, .3)',
  'rgba(168, 65, 213, .3)',
  'rgba(94, 65, 213, .1)',
]

export const CLIENT_PROVIDERS = [
  {
    provider: 'GETH',
    title: 'Decentralized Full Node',
    subTitle: 'Ethereum Foundation',
    language: 'Go',
  },
  {
    provider: 'Open Ethereum',
    title: 'Decentralized Lightclient',
    subTitle: 'Parity / Open Ethereum',
    language: 'Rust',
  },
  {
    provider: 'Nethermind',
    title: 'Enterprise Grade Full Node',
    subTitle: 'Nethermind',
    language: '.NET',
  },
  {
    provider: 'Infura',
    title: 'Centralized Cloud Provider',
    subTitle: 'Consensys',
    language: 'API',
  },
  {
    provider: 'Besu',
    title: 'Enterprise Public / Private Permission',

    subTitle: 'Hyperledger',
    language: 'Javascript',
  },
] as ClientProvider[]

export const initialEthDeposit = 32
export const secondsInSlot = 12
export const slotsInEpoc = 32;
export const secondsInEpoch = secondsInSlot * 32
export const slotsInHour = 3600 / secondsInSlot
export const slotsInDay = slotsInHour * 24
export const slotsInWeek = slotsInDay * 7
export const slotsInMonth = slotsInDay * 30

export const EARNINGS_OPTIONS = [
  {
    title: 'hourly',
    value: slotsInHour,
  },
  {
    title: 'daily',
    value: slotsInDay,
  },
  {
    title: 'weekly',
    value: slotsInWeek,
  },
  {
    title: 'monthly',
    value: slotsInMonth,
  },
  {
    title: 'total',
    value: 0,
  },
] as EarningOption[]

export const BeaconChaValidatorUrl = 'https://beaconcha.in/validator'
