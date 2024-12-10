import { atom } from 'recoil'
import { AppView, OnboardView, UiMode } from '../constants/enums'
import { ActiveDevice, AlertMessage, EthExchangeRates, ProposerDuty, ValAliases } from '../types'
import { BeaconNodeSpecResults } from '../types/beacon'
import { HealthDiagnosticResult } from '../types/diagnostic'

export const uiMode = atom<UiMode>({
  key: 'UiMode',
  default: undefined,
})

export const appView = atom<AppView | undefined>({
  key: 'AppView',
  default: undefined,
})

export const onBoardView = atom<OnboardView>({
  key: 'OnboardView',
  default: OnboardView.CONFIGURE,
})

export const userName = atom<string>({
  key: 'userName',
  default: undefined,
})

export const beaconHealthResult = atom<HealthDiagnosticResult | undefined>({
  key: 'beaconHealthResult',
  default: undefined,
})

export const exchangeRates = atom<EthExchangeRates | undefined>({
  key: 'exchangeRates',
  default: undefined,
})

export const isSideBarOpen = atom<boolean>({
  key: 'isSideBarOpen',
  default: false,
})

export const validatorNetworkError = atom<boolean>({
  key: 'validatorNetworkError',
  default: false,
})

export const beaconNetworkError = atom<boolean>({
  key: 'beaconNetworkError',
  default: false,
})

export const sessionAuthErrorCount = atom<number>({
  key: 'sessionAuthErrorCount',
  default: 0,
})

export const isBlsExecutionModal = atom<boolean>({
  key: 'isBlsExecutionModal',
  default: false,
})

export const processingBlsValidators = atom<(string | number)[]>({
  key: 'processingBlsValidators',
  default: undefined,
})

export const validatorAliases = atom<ValAliases | undefined>({
  key: 'validatorAliases',
  default: undefined,
})

export const activeDevice = atom<ActiveDevice>({
  key: 'activeDevice',
  default: undefined,
})

export const alertLogs = atom<AlertMessage[]>({
  key: 'alertLogs',
  default: [],
})

export const proposerDuties = atom<ProposerDuty[]>({
  key: 'proposerDuties',
  default: [],
})

export const beaconNodeSpec = atom<BeaconNodeSpecResults>({
  key: 'beaconNodeSpec',
  default: undefined,
})

export const activeValidatorId = atom<number | undefined>({
  key: 'activeValidatorId',
  default: undefined,
})

export const isEditValidator = atom<boolean>({
  key: 'isEditValidator',
  default: undefined,
})

export const isValidatorDetail = atom<boolean>({
  key: 'isValidatorDetail',
  default: undefined,
})

export const isWalletConnectModal = atom<boolean>({
  key: 'isWalletConnectModal',
  default: false,
})
