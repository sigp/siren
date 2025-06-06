import React, { FC } from 'react'
import { SettingsView } from '../../../constants/enums'
import AboutSettings, { AboutSettingsProps } from './AboutSettings'
import GeneralSettings from './GeneralSettings'

export interface ViewControllerProps extends AboutSettingsProps {
  view: SettingsView
}

const ViewController: FC<ViewControllerProps> = ({ view, ...props }) => {
  if (view === SettingsView.GENERAL) {
    return <GeneralSettings />
  }

  if (view === SettingsView.ABOUT) {
    return <AboutSettings {...props} />
  }

  return null
}

export default ViewController
