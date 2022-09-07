import {FunctionComponent, SVGProps} from "react";

import {ReactComponent as DashLogo} from "../../assets/images/dashboard.svg";
import {ReactComponent as ValidatorLogo} from "../../assets/images/validators.svg";
import {ReactComponent as LogsLogo} from "../../assets/images/logs.svg";
import {ReactComponent as GrafanaLogo} from "../../assets/images/grafana.svg";
import {ReactComponent as SettingsLogo} from "../../assets/images/settings.svg";

export type ViewType = {
    title: string,
    logoComponent: FunctionComponent<SVGProps<SVGSVGElement>>
}

export const VIEW = {
    DASH: {
        title: 'Dashboard',
        logoComponent: DashLogo
    },
    VALIDATORS: {
        title: 'Validator Management',
        logoComponent: ValidatorLogo
    },
    LOGS: {
        title: 'Logs',
        logoComponent: LogsLogo
    },
    GRAFANA: {
        title: 'Grafana',
        logoComponent: GrafanaLogo
    },
    SETTINGS: {
        title: 'Settings',
        logoComponent: SettingsLogo
    }
}

export const PRIMARY_VIEWS = [VIEW.DASH, VIEW.VALIDATORS, VIEW.LOGS, VIEW.GRAFANA] as ViewType[];
export const SECONDARY_VIEWS = [VIEW.SETTINGS] as ViewType[];

