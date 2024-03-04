import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import FootBar from '../../components/FootBar/FootBar'
import NetworkErrorModal from '../../components/NetworkErrorModal/NetworkErrorModal'
import SideBar from '../../components/SideBar/SideBar'
import TopBar from '../../components/TopBar/TopBar'
import { ContentView, Storage, UiMode } from '../../constants/enums'
import useAtomCleanup from '../../hooks/useAtomCleanup'
import useLocalStorage from '../../hooks/useLocalStorage'
import { activeCurrency, dashView, processingBlsValidators, uiMode } from '../../recoil/atoms'
import { ActiveCurrencyStorage, UiThemeStorage } from '../../types/storage'
import MainPollingWrapper from '../../wrappers/MainPollingWrapper'
import ValidatorPollingWrapper from '../../wrappers/ValidatorPollingWrapper'
import Grafana from './Content/Grafana'
import Logs from './Content/Logs'
import MainContent from './Content/MainContent'
import Settings from './Content/Settings'
import Validators from './Content/Validators'

const Dashboard = () => {
  const mode = useRecoilValue(uiMode)
  const content = useRecoilValue(dashView)
  const { resetDashboardAtoms } = useAtomCleanup()
  const setIsProcess = useSetRecoilState(processingBlsValidators)

  useEffect(() => {
    return () => {
      resetDashboardAtoms()
    }
  }, [])

  const [uiTheme, setUiTheme] = useRecoilState(uiMode)
  const [currency, setActiveCurrency] = useRecoilState(activeCurrency)

  const [processingValidators] = useLocalStorage<string>(Storage.BLS_PROCESSING, '')
  const [uiThemeStorage] = useLocalStorage<UiThemeStorage>(Storage.UI, undefined)
  const [activeCurrencyStorage] = useLocalStorage<ActiveCurrencyStorage>(
    Storage.CURRENCY,
    undefined,
  )

  useEffect(() => {
    if (processingValidators) {
      setIsProcess(JSON.parse(processingValidators))
    }
  }, [processingValidators])

  useEffect(() => {
    if (uiTheme) return
    setUiTheme(uiThemeStorage || UiMode.LIGHT)
  }, [uiTheme, uiThemeStorage])

  useEffect(() => {
    if (currency) return

    setActiveCurrency(activeCurrencyStorage || 'USD')
  }, [activeCurrencyStorage, currency])

  const renderContent = () => {
    switch (content) {
      case ContentView.GRAFANA:
        return <Grafana />
      case ContentView.VALIDATORS:
        return (
          <ValidatorPollingWrapper>
            <Validators />
          </ValidatorPollingWrapper>
        )
      case ContentView.SETTINGS:
        return <Settings />
      case ContentView.LOGS:
        return <Logs />
      default:
        return (
          <MainPollingWrapper>
            <MainContent />
          </MainPollingWrapper>
        )
    }
  }
  return (
    <div
      className={`${
        mode === UiMode.DARK ? 'dark' : ''
      } w-screen h-screen flex overflow-hidden relative`}
    >
      <SideBar />
      <NetworkErrorModal />
      <div className='flex flex-1 flex-col bg-white dark:bg-darkPrimary items-center justify-center'>
        <TopBar />
        <div className='flex-1 w-full overflow-scroll'>{renderContent()}</div>
        <FootBar />
      </div>
    </div>
  )
}

export default Dashboard
