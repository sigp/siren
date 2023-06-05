import './global.css'
import './i18n'
import App from './App'
import 'react-tooltip/dist/react-tooltip.css'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'

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
