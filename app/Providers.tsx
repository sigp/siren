'use client'

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import React, { FC, ReactElement } from 'react'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'rodal/lib/rodal.css'
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  holesky
} from 'wagmi/chains';
const config = getDefaultConfig({
  appName: 'SIREN',
  projectId: 'SIREN',
  chains: [mainnet, holesky],
  ssr: true,
} as any);

const queryClient = new QueryClient()

export interface ProviderProps {
  children: ReactElement | ReactElement[]
}

const Providers: FC<ProviderProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <WagmiProvider config={config as any}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
            <ToastContainer />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </RecoilRoot>
  )
}

export default Providers
