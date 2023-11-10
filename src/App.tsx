import React, { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import { appView } from './recoil/atoms'
import { AppView } from './constants/enums'
import Dashboard from './views/DashBoard/Dashboard'
import Onboard from './views/Onboard/Onboard'
import InitScreen from './views/InitScreen'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'
import SSELogProvider from './components/SSELogProvider/SSELogProvider'
import SyncPollingWrapper from './wrappers/SyncPollingWrapper'
import ChangeScreen from './views/ChangeScreen'
import AppLoadFallback from './components/Fallback/AppLoadFallback'

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
        return <InitScreen />
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
