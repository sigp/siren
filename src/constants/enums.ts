export enum UiMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export enum ContentView {
  MAIN = 'MAIN',
  VALIDATORS = 'VALIDATORS',
  LOGS = 'LOGS',
  GRAFANA = 'GRAFANA',
  SETTINGS = 'SETTINGS',
}

export enum AppView {
  ONBOARD = 'ONBOARD',
  DASHBOARD = 'DASHBOARD',
  CHANGE_SCREEN = 'CHANGE_SCREEN',
  INIT = 'INIT',
}

export enum OnboardView {
  PROVIDER = 'PROVIDER',
  CONFIGURE = 'CONFIGURE',
  SESSION = 'SESSION',
  SETUP = 'SETUP',
}

export enum ConfigType {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
}

export enum Protocol {
  HTTP = 'http',
  HTTPS = 'https',
}

export enum DiagnosticType {
  DEVICE = 'DEVICE',
  NETWORK = 'NETWORK',
}

export enum DiagnosticRate {
  FAIR = 'FAIR',
  POOR = 'POOR',
  GOOD = 'GOOD',
  GREAT = 'GREAT',
}

export enum SetupSteps {
  HEALTH = 'HEALTH',
  SYNC = 'SYNC',
}

export enum Storage {
  UI = 'UI',
  CURRENCY = 'CURRENCY',
  BLS_PROCESSING = 'BLS_PROCESSING',
}

export enum ApiType {
  VALIDATOR = 'VALIDATOR',
  BEACON = 'BEACON',
}

export enum Network {
  Goerli = 'Goerli',
  Mainnet = 'Mainnet',
  LocalTestnet = 'Local TestNet',
}

export enum ValidatorModalView {
  DETAILS = 'DETAILS',
  EXIT = 'EXIT',
}
