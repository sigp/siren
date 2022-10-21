import SideBar from '../../components/SideBar/SideBar';
import FootBar from '../../components/FootBar/FootBar';
import React, { useEffect, useState } from 'react';
import MainContent from './Content/MainContent';
import { useRecoilState, useRecoilValue } from 'recoil';
import { dashView, uiMode } from '../../recoil/atoms';
import { ContentView, Storage, UiMode } from '../../constants/enums';
import Logs from './Content/Logs';
import Settings from './Content/Settings';
import Validators from './Content/Validators';
import Grafana from './Content/Grafana';
import TopBar from '../../components/TopBar/TopBar';
import useBeaconSyncPolling from '../../hooks/useBeaconSyncPolling';
import useLocalStorage from '../../hooks/useLocalStorage';
import { UiThemeStorage } from '../../types/storage';

const Sync = () => {
  useBeaconSyncPolling()
  return null
}

const Dashboard = () => {
  const content = useRecoilValue(dashView)
  const [isReadySync, setSync] = useState(false)

  useEffect(() => {
    setSync(true)
  }, [])

  const [uiTheme, setUiTheme] = useRecoilState(uiMode);

  const [uiThemeStorage] = useLocalStorage<UiThemeStorage>(Storage.UI, undefined);

  useEffect(() => {
    if(uiTheme) return;
    setUiTheme(uiThemeStorage || UiMode.LIGHT);
  }, [uiTheme, uiThemeStorage])

  const renderContent = () => {
    switch (content) {
      case ContentView.GRAFANA:
        return <Grafana />
      case ContentView.VALIDATORS:
        return <Validators />
      case ContentView.SETTINGS:
        return <Settings />
      case ContentView.LOGS:
        return <Logs />
      default:
        return <MainContent />
    }
  }
  return (
    <>
      {isReadySync && <Sync/>}
      <SideBar />
      <div className='flex flex-1 flex-col bg-white dark:bg-darkPrimary items-center justify-center'>
        <TopBar />
        <div className='flex-1 w-full overflow-scroll'>{renderContent()}</div>
        <FootBar />
      </div>
    </>
  )
}

export default Dashboard
