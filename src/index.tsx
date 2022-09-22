import './global.css'
import App from './App'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'

const container = document.getElementById('root')
const root = createRoot(container as Element)
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
)
