import React, { FC } from 'react'
import { SettingsView } from '../../../constants/enums'
import AboutSettings, { AboutSettingsProps } from './AboutSettings'
import DataSettings, { DataSettingsProps } from './DataSettings'
import GeneralSettings from './GeneralSettings'

export interface ViewControllerProps extends AboutSettingsProps, DataSettingsProps {
  view: SettingsView
}

const ViewController: FC<ViewControllerProps> = ({ view, initExclusions, ...props }) => {
  if (view === SettingsView.GENERAL) {
    return <GeneralSettings />
  }

  if (view === SettingsView.DATA) {
    return <DataSettings initExclusions={initExclusions} />
  }

  if (view === SettingsView.ABOUT) {
    return <AboutSettings {...props} />
  }

  return null
}

export default ViewController
