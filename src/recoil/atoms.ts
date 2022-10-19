import { atom } from 'recoil'
import { AppView, ContentView, OnboardView, SetupSteps, UiMode } from '../constants/enums'
import { Endpoint } from '../forms/ConfigConnectionForm'
import { BeaconSyncResult } from '../types/diagnostic'
import { BeaconValidatorResult } from '../types/validator';

export const uiMode = atom<UiMode>({
  key: 'UiMode',
  default: UiMode.LIGHT,
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

export const beaconSyncInfo = atom<BeaconSyncResult>({
  key: 'beaconSyncInfos',
  default: undefined,
})

export const validatorStateInfo = atom<BeaconValidatorResult[]>({
  key: 'validatorStateInfo',
  default: undefined,
})

export const beaconSyncIntervalId = atom<NodeJS.Timer | undefined>({
  key: 'beaconSyncIntervalId',
  default: undefined
})
