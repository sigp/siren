import SideBar from '../../components/SideBar/SideBar'
import FootBar from '../../components/FootBar/FootBar'
import React, { useEffect, Suspense } from 'react'
import MainContent from './Content/MainContent'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  activeCurrency,
  beaconNetworkError,
  dashView,
  processingBlsValidators,
  sessionAuthErrorCount,
  uiMode,
  validatorNetworkError,
} from '../../recoil/atoms'
import { ContentView, Storage, UiMode } from '../../constants/enums'
import Logs from './Content/Logs'
import Settings from './Content/Settings'
import Validators from './Content/Validators'
import Grafana from './Content/Grafana'
import TopBar from '../../components/TopBar/TopBar'
import useLocalStorage from '../../hooks/useLocalStorage'
import { ActiveCurrencyStorage, UiThemeStorage } from '../../types/storage'
import Spinner from '../../components/Spinner/Spinner'
import NetworkErrorModal from '../../components/NetworkErrorModal/NetworkErrorModal'
import MainPollingWrapper from '../../wrappers/MainPollingWrapper'
import ValidatorPollingWrapper from '../../wrappers/ValidatorPollingWrapper'

const DashboardFallback = () => (
  <div className='h-full w-full flex items-center justify-center'>
    <Spinner />
  </div>
)

const Dashboard = () => {
  const mode = useRecoilValue(uiMode)
  const content = useRecoilValue(dashView)
  const isBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const isValidatorNetworkError = useSetRecoilState(validatorNetworkError)
  const setSessionAuthErrorCount = useSetRecoilState(sessionAuthErrorCount)
  const setIsProcess = useSetRecoilState(processingBlsValidators)

  useEffect(() => {
    return () => {
      isBeaconNetworkError(false)
      isValidatorNetworkError(false)
      setSessionAuthErrorCount(0)
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
        <div className='flex-1 w-full overflow-scroll'>
          <Suspense fallback={<DashboardFallback />}>{renderContent()}</Suspense>
        </div>
        <FootBar />
      </div>
    </div>
  )
}

export default Dashboard
