import './global.css'
import './i18n'
import App from './App'
import 'react-tooltip/dist/react-tooltip.css'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'

const container = document.getElementById('root')
const root = createRoot(container as Element)
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
)
