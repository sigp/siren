import React from 'react'
import { useRecoilValue } from 'recoil'
import { appView, uiMode } from './recoil/atoms'
import { AppView, UiMode } from './constants/enums'
import Dashboard from './views/DashBoard/Dashboard'
import Onboard from './views/Onboard/Onboard'

function App() {
  const mode = useRecoilValue(uiMode)
  const view = useRecoilValue(appView)

  return (
    <div
      className={`${
        mode === UiMode.DARK ? 'dark' : ''
      } relative h-screen w-screen overflow-hidden flex`}
    >
      {view === AppView.DASHBOARD ? <Dashboard /> : <Onboard />}
    </div>
  )
}

export default App
