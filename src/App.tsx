import React from 'react'
import { useRecoilValue } from 'recoil'
import { appView, uiMode } from './recoil/atoms'
import { AppView, UiMode } from './constants/enums'
import Dashboard from './views/DashBoard/Dashboard'
import Onboard from './views/Onboard/Onboard'
import InitScreen from './views/InitScreen'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'

function App() {
  const mode = useRecoilValue(uiMode)
  const view = useRecoilValue(appView)

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard />
      case AppView.ONBOARD:
        return <Onboard />
      default:
        return <InitScreen />
    }
  }

  return (
    <div
      className={`${
        mode === UiMode.DARK ? 'dark' : ''
      } relative h-screen w-screen overflow-hidden flex`}
    >
      {renderView()}
      <ToastContainer />
    </div>
  )
}

export default App
