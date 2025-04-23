import { FunctionComponent, SVGProps } from 'react'
import DashLogo from '../assets/images/dashboard.svg'
import GrafanaLogo from '../assets/images/grafana.svg'
import LogsLogo from '../assets/images/logs.svg'
import SettingsLogo from '../assets/images/settings.svg'
import ValidatorLogo from '../assets/images/validators.svg'
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
