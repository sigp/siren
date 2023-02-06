import { atom } from 'recoil'
import { AppView, ContentView, OnboardView, SetupSteps, UiMode } from '../constants/enums'
import { Endpoint } from '../types'
import { BeaconSyncResult, HealthDiagnosticResult, ValidatorSyncResult } from '../types/diagnostic'
import { BeaconValidatorResult, ValidatorCacheResults } from '../types/validator'

export const uiMode = atom<UiMode>({
  key: 'UiMode',
  default: undefined,
})

export const appView = atom<AppView | undefined>({
  key: 'AppView',
  default: undefined,
})

export const dashView = atom<ContentView>({
  key: 'DashView',
  default: ContentView.MAIN,
})

export const onBoardView = atom<OnboardView>({
  key: 'OnboardView',
  default: OnboardView.CONFIGURE,
})

export const beaconNodeEndpoint = atom<Endpoint>({
  key: 'BeaconNode',
  default: undefined,
})

export const validatorClientEndpoint = atom<Endpoint>({
  key: 'ValidatorClient',
  default: undefined,
})

export const apiToken = atom<string>({
  key: 'ApiToken',
  default: undefined,
})

export const setupStep = atom<SetupSteps | undefined>({
  key: 'SetupStep',
  default: undefined,
})

export const validatorSyncInfo = atom<ValidatorSyncResult>({
  key: 'validatorSyncInfo',
  default: undefined,
})

export const validatorSyncInterval = atom<NodeJS.Timer | undefined>({
  key: 'validatorSyncInterval',
  default: undefined,
})

export const beaconSyncInfo = atom<BeaconSyncResult>({
  key: 'beaconSyncInfos',
  default: undefined,
})

export const validatorStateInfo = atom<BeaconValidatorResult[]>({
  key: 'validatorStateInfo',
  default: undefined,
})

export const validatorInfoInterval = atom<NodeJS.Timer | undefined>({
  key: 'validatorInfoInterval',
  default: undefined,
})

export const beaconEpochInterval = atom<NodeJS.Timer | undefined>({
  key: 'beaconEpochInterval',
  default: undefined,
})

export const beaconSyncInterval = atom<NodeJS.Timer | undefined>({
  key: 'beaconSyncInterval',
  default: undefined,
})

export const userName = atom<string>({
  key: 'userName',
  default: undefined,
})

export const validatorVersionData = atom<string | undefined>({
  key: 'validatorVersionData',
  default: undefined,
})

export const beaconVersionData = atom<string | undefined>({
  key: 'beaconVersionData',
  default: undefined,
})

export const validatorHealthResult = atom<HealthDiagnosticResult | undefined>({
  key: 'validatorHealthResult',
  default: undefined,
})

export const validatorHealthSyncInterval = atom<NodeJS.Timer | undefined>({
  key: 'validatorHealthSyncInterval',
  default: undefined,
})

export const beaconHealthResult = atom<HealthDiagnosticResult | undefined>({
  key: 'beaconHealthResult',
  default: undefined,
})

export const beaconHealthSyncInterval = atom<NodeJS.Timer | undefined>({
  key: 'beaconHealthSyncInterval',
  default: undefined,
})

export const validatorSearch = atom<string>({
  key: 'validatorSearch',
  default: '',
})

export const validatorIndex = atom<number | undefined>({
  key: 'validatorIndex',
  default: undefined,
})

export const validatorPeerCount = atom<number | undefined>({
  key: 'validatorPeerCount',
  default: undefined,
})

export const activeCurrency = atom<string>({
  key: 'activeCurrency',
  default: undefined,
})

export const validatorCacheBalanceResult = atom<ValidatorCacheResults | undefined>({
  key: 'validatorCacheBalanceResult',
  default: undefined,
})
