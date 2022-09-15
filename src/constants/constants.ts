import {FunctionComponent, SVGProps} from "react";

import {ReactComponent as DashLogo} from "../assets/images/dashboard.svg";
import {ReactComponent as ValidatorLogo} from "../assets/images/validators.svg";
import {ReactComponent as LogsLogo} from "../assets/images/logs.svg";
import {ReactComponent as GrafanaLogo} from "../assets/images/grafana.svg";
import {ReactComponent as SettingsLogo} from "../assets/images/settings.svg";
import {ContentView} from "./enums";
import {ValidatorStatus} from "../types/validator";
import {ClientProvider} from "../types";

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

export const FAKE_VALIDATORS = [
    {
        title: 'Centipede Alien Miles Knightly',
        id: 1,
        pubKey: '0xb9d94c35',
        balance: 32.0963,
        rewards: 0.0963,
        processed: 1,
        missed: 0,
        attested: 768,
        aggregated: 560,
        status: 'unknown' as ValidatorStatus
    },
    {
        title: 'Doofus Rick',
        id: 2,
        pubKey: '0xb9da2c35',
        balance: 2.0963,
        rewards: 1.0963,
        processed: 2,
        missed: 1,
        attested: 450,
        aggregated: 160,
        status: 'queue' as ValidatorStatus
    },
    {
        title: 'Crocubot',
        id: 3,
        pubKey: '0xb9da2c35',
        balance: 25.0963,
        rewards: 1.0963,
        processed: 2,
        missed: 1,
        attested: 450,
        aggregated: 160,
        status: 'active-slash' as ValidatorStatus
    },
    {
        title: 'Two Crows',
        id: 4,
        pubKey: '0xb9da2c35',
        balance: 22.0963,
        rewards: 1.0963,
        processed: 2,
        missed: 1,
        attested: 450,
        aggregated: 160,
        status: 'active' as ValidatorStatus
    },
    {
        title: 'Pickle Rick',
        id: 5,
        pubKey: '0xb9da2c35',
        balance: 12.0963,
        rewards: 1.0963,
        processed: 2,
        missed: 1,
        attested: 450,
        aggregated: 160,
        status: 'unknown' as ValidatorStatus
    }
];

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

export const CLIENT_PROVIDERS = [
    {
        provider: 'GETH',
        title: 'Decentralized Full Node',
        subTitle: 'Ethereum Foundation',
        language: 'Go',
    },
    {
        provider: 'Open Ethereum',
        title: 'Decentralized Lightclient',
        subTitle: 'Parity / Open Ethereum',
        language: 'Rust',
    },
    {
        provider: 'Nethermind',
        title: 'Enterprise Grade Full Node',
        subTitle: 'Nethermind',
        language: '.NET',
    },
    {
        provider: 'Infura',
        title: 'Centralized Cloud Provider',
        subTitle: 'Consensys',
        language: 'API',
    },
    {
        provider: 'Besu',
        title: 'Enterprise Public / Private Permission',
        subTitle: 'Hyperledger',
        language: 'Javascript',
    }
] as ClientProvider[]

