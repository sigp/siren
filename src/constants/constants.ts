import { FunctionComponent, SVGProps } from 'react'

import DashLogo from '../assets/images/dashboard.svg'
import GrafanaLogo from '../assets/images/grafana.svg'
import LogsLogo from '../assets/images/logs.svg'
import SettingsLogo from '../assets/images/settings.svg'
import ValidatorLogo from '../assets/images/validators.svg'
import { LogType } from '../types'
import { EarningOption } from '../types/validator'
import { ContentView } from './enums'

export type ViewType = {
  title: string
  isDisabled?: boolean
  logoComponent: FunctionComponent<SVGProps<SVGSVGElement>>
  key: ContentView
  href: string
}

export const VIEW = {
  DASH: {
    href: '/dashboard',
    title: 'sidebar.dashboard',
    logoComponent: DashLogo,
    key: ContentView.MAIN,
  },
  VALIDATORS: {
    href: '/dashboard/validators',
    title: 'sidebar.validatorManagement',
    logoComponent: ValidatorLogo,
    key: ContentView.VALIDATORS,
  },
  LOGS: {
    href: '/dashboard/logs',
    title: 'sidebar.logs',
    logoComponent: LogsLogo,
    key: ContentView.LOGS,
  },
  GRAFANA: {
    href: '/dashboard/grafana',
    title: 'sidebar.grafana',
    logoComponent: GrafanaLogo,
    key: ContentView.GRAFANA,
    isDisabled: true,
  },
  SETTINGS: {
    href: '/dashboard/settings',
    title: 'sidebar.settings',
    logoComponent: SettingsLogo,
    key: ContentView.SETTINGS,
  },
}

export const PRIMARY_VIEWS = [VIEW.DASH, VIEW.VALIDATORS, VIEW.LOGS, VIEW.GRAFANA] as ViewType[]
export const SECONDARY_VIEWS = [VIEW.SETTINGS] as ViewType[]

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

export const initialEthDeposit = 32
export const slotsInEpoc = 32
export const secondsInHour = 3600
export const secondsInDay = 86400
export const secondsInWeek = 604800

export const EARNINGS_OPTIONS = [
  {
    title: 'hourly',
    value: 0,
  },
  {
    title: 'daily',
    value: 1,
  },
  {
    title: 'weekly',
    value: 2,
  },
  {
    title: 'monthly',
    value: 3,
  },
  {
    title: 'total',
    value: undefined,
  },
] as EarningOption[]

export const BeaconChaValidatorUrl = 'https://beaconcha.in/validator'
export const HoleskyBeaconChaValidatorUrl = 'https://holesky.beaconcha.in/validator'
export const SepoliaBeaconChaValidatorUrl = 'https://sepolia.beaconcha.in/validator'
export const KubernetsValidatorUrl = 'http://127.0.0.1:64498/validator'
export const DiscordUrl = 'https://discord.gg/mB3VZQpYvN'
export const LighthouseBookUrl = 'https://lighthouse-book.sigmaprime.io/'
export const SigPGithubUrl = 'https://github.com/sigp'
export const SigPTwitter = 'https://twitter.com/sigp_io'
export const SigPIoUrl = 'https://sigmaprime.io/'
export const WithdrawalInfoLink = 'https://launchpad.ethereum.org/en/withdrawals'
export const CoinbaseExchangeRateUrl = 'https://api.coinbase.com/v2/exchange-rates?currency=ETH'

export const CURRENCIES = [
  'AUD',
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'CAD',
  'CHF',
  'CNH',
  'BTC',
  'HKD',
  'NZD',
]

export const REQUIRED_VALIDATOR_VERSION = {
  major: 4,
  minor: 3,
  patch: 0,
}

export const MAX_PERSISTED_LOGS = 1000
export const MAX_SESSION_UNLOCK_ATTEMPTS = 3

export const MOCK_BLS_JSON = `[
  {
    "message": {
      "validator_index": "0",
      "from_bls_pubkey": "your-pub-key",
      "to_execution_address": "your-execution-address"
    },
    "signature": "your-signature",
    "metadata": {
      "network_name": "network",
      "genesis_validators_root": "genesis-validators-root",
      "deposit_cli_version": "x.x.x"
    }
  }
]`

export const LogTypeOptions = [
  { title: 'Validator', value: LogType.VALIDATOR },
  { title: 'Beacon', value: LogType.BEACON },
]

export const ALERT_ID = {
  VALIDATOR_SYNC: 'VALIDATOR_SYNC',
  BEACON_SYNC: 'BEACON_SYNC',
  NAT: 'NAT',
  WARNING_LOG: 'WARNING_LOG',
  PEER_COUNT: 'PEER_COUNT',
}

export const DEVICE_NAME_TRUNCATE = 10
export const EFFECTIVE_BALANCE = 32
