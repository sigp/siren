'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import React, { FC, ReactElement } from 'react'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'
import { WagmiProvider } from 'wagmi'
import createWagmiConfig from '../utilities/createWagmiConfig'
const queryClient = new QueryClient()

export interface ProviderProps {
  children: ReactElement | ReactElement[]
}

const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <WagmiProvider reconnectOnMount config={createWagmiConfig()}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
        </QueryClientProvider>
      </WagmiProvider>
    </RecoilRoot>
  )
}

export default Providers
