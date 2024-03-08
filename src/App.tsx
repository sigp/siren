import React, { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import Main from '../app/Main'
import AppLoadFallback from './components/Fallback/AppLoadFallback'
import SSELogProvider from './components/SSELogProvider/SSELogProvider'
import { AppView } from './constants/enums'
import { appView } from './recoil/atoms'
import ChangeScreen from './views/ChangeScreen'
import Dashboard from './views/DashBoard/Dashboard'
import Onboard from './views/Onboard/Onboard'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'
import SyncPollingWrapper from './wrappers/SyncPollingWrapper'

function App() {
  const view = useRecoilValue(appView)

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return (
          <Suspense fallback={<AppLoadFallback />}>
            <SyncPollingWrapper>
              <SSELogProvider>
                <Dashboard />
              </SSELogProvider>
            </SyncPollingWrapper>
          </Suspense>
        )
      case AppView.ONBOARD:
        return (
          <Suspense fallback={<AppLoadFallback />}>
            <Onboard />
          </Suspense>
        )
      case AppView.CHANGE_SCREEN:
        return <ChangeScreen />
      default:
        return <Main />
    }
  }

  return (
    <>
      {renderView()}
      <ToastContainer />
    </>
  )
}

export default App
