import { LogType } from '../types'
import { EarningOption } from '../types/validator'

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
export const HoodiBeaconChaValidatorUrl = 'https://hoodi.beaconcha.in/validator'
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
export const FETCH_LOG_LIMIT = 15
export const MAX_EFFECTIVE_BALANCE = 2048
export const MAX_BALANCE_INPUT = 9999
export const MAX_MNEMONIC_INDEX = 4294967295
export const CONSOLIDATION_CONTRACT = '0x0000BBdDc7CE488642fb579F8B00f3a590007251'
export const EXECUTION_WITHDRAWAL_CONTRACT = '0x00000961Ef480Eb55e80D19ad83579A64c007002'
export const HOLESKY_PECTRA_FORK_VERSION = '0x06017000'
export const HOODI_PECTRA_FORK_VERSION = '0x60000910'
export const MAINNET_PECTRA_FORK_VERSION = '0x05000000'
