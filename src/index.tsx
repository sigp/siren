import './global.css'
import './i18n'
import 'react-tooltip/dist/react-tooltip.css'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container as Element)
const queryClient = new QueryClient()
root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>,
)
