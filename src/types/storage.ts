import { DeviceList, OptionalBoolean, OptionalString } from './index'
import { UiMode } from '../constants/enums'

export type HealthCheckStorage = OptionalBoolean
export type UiThemeStorage = UiMode | undefined
export type UsernameStorage = OptionalString
export type ActiveCurrencyStorage = OptionalString
export type ValidatorIndicesStorage = OptionalString
export type DeviceListStorage = DeviceList | undefined
export type DeviceKeyStorage = OptionalString
