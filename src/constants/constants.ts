import {FunctionComponent, SVGProps} from "react";

import {ReactComponent as DashLogo} from "../assets/images/dashboard.svg";
import {ReactComponent as ValidatorLogo} from "../assets/images/validators.svg";
import {ReactComponent as LogsLogo} from "../assets/images/logs.svg";
import {ReactComponent as GrafanaLogo} from "../assets/images/grafana.svg";
import {ReactComponent as SettingsLogo} from "../assets/images/settings.svg";
import {ContentView} from "./enums";

export type ViewType = {
    title: string,
    logoComponent: FunctionComponent<SVGProps<SVGSVGElement>>,
    key: ContentView
}

export const VIEW = {
    DASH: {
        title: 'Dashboard',
        logoComponent: DashLogo,
        key: ContentView.DASHBOARD
    },
    VALIDATORS: {
        title: 'Validator Management',
        logoComponent: ValidatorLogo,
        key: ContentView.VALIDATORS,
    },
    LOGS: {
        title: 'Logs',
        logoComponent: LogsLogo,
        key: ContentView.LOGS,
    },
    GRAFANA: {
        title: 'Grafana',
        logoComponent: GrafanaLogo,
        key: ContentView.GRAFANA,
    },
    SETTINGS: {
        title: 'Settings',
        logoComponent: SettingsLogo,
        key: ContentView.SETTINGS
    }
}

export const PRIMARY_VIEWS = [VIEW.DASH, VIEW.VALIDATORS, VIEW.LOGS, VIEW.GRAFANA] as ViewType[];
export const SECONDARY_VIEWS = [VIEW.SETTINGS] as ViewType[];

