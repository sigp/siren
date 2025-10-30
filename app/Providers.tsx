'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { FC, ReactElement } from 'react'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'
import { WagmiProvider } from 'wagmi'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'
import createWagmiConfig from '../utilities/createWagmiConfig'
const queryClient = new QueryClient()

export interface ProviderProps {
  children: ReactElement | ReactElement[]
}

export const wagmiConfig = createWagmiConfig()

const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <WagmiProvider reconnectOnMount config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <SWRConfig
            value={{
              // Enable caching across page navigation
              keepPreviousData: true,
              // Allow 5 second deduplication window for identical requests
              dedupingInterval: 5000,
              // Disable auto-revalidation on focus/reconnect (we use polling instead)
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              // Throttle refetch on window focus
              focusThrottleInterval: 10000,
              // Use SWR's default global cache (omit provider)
            }}
          >
            {children}
            <ToastContainer />
          </SWRConfig>
        </QueryClientProvider>
      </WagmiProvider>
    </RecoilRoot>
  )
}

export default Providers
