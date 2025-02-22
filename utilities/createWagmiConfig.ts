import { defineChain, Chain } from 'viem'
import { createConfig, http, Config } from 'wagmi'
import { mainnet, holesky } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const localChainId = process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID
  ? Number(process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID)
  : undefined
const localRpc = process.env.NEXT_PUBLIC_TESTNET_RPC
const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID

const createWagmiConfig = () => {
  const chains: Chain[] = [mainnet, holesky]
  const transports: Record<number, ReturnType<typeof http>> = {
    [mainnet.id]: http(),
    [holesky.id]: http(),
  }

  const mekongTestnet: Chain = defineChain({
    id: 7078815900,
    name: 'Mekong',
    network: 'mekong',
    rpcUrls: { default: { http: ['https://rpc.mekong.ethpandaops.io/'] } },
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    testnet: true,
  })
  chains.push(mekongTestnet)
  transports[mekongTestnet.id] = http()

  if (localChainId && localRpc) {
    const customLocalhost: Chain = defineChain({
      id: localChainId,
      name: 'Localhost',
      network: 'localhost',
      rpcUrls: { default: { http: [localRpc] } },
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      testnet: true,
    })
    chains.push(customLocalhost)
    transports[customLocalhost.id] = http()
  }

  const configOptions = {
    chains,
    ssr: true,
    transports,
    ...(walletConnectId && {
      connectors: [walletConnect({ projectId: walletConnectId })],
    }),
  }

  return createConfig(configOptions)
}

export default createWagmiConfig
