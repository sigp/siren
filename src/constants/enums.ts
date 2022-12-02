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
}

export enum OnboardView {
  PROVIDER = 'PROVIDER',
  CONFIGURE = 'CONFIGURE',
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
}
