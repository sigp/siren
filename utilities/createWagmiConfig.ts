import { defineChain, Chain } from 'viem'
import { createConfig, http } from 'wagmi'
import { mainnet, holesky } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

const localChainId = process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID
  ? Number(process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID)
  : undefined
const localRpc = process.env.NEXT_PUBLIC_TESTNET_RPC
const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID
const nativeCurrency = { name: 'Ether', symbol: 'ETH', decimals: 18 }

const createWagmiConfig = () => {
  const hoodi = defineChain({
    id: 560048,
    name: 'Hoodi testnet',
    network: 'Hoodi testnet',
    rpcUrls: { default: { http: ['https://0xrpc.io/hoodi'] } },
    nativeCurrency,
  })
  const chains: Chain[] = [mainnet, holesky, hoodi]
  const transports: Record<number, ReturnType<typeof http>> = {
    [mainnet.id]: http(),
    [holesky.id]: http(),
    [hoodi.id]: http()
  }

  if (localChainId && localRpc) {
    const customLocalhost: Chain = defineChain({
      id: localChainId,
      name: 'Localhost',
      network: 'localhost',
      rpcUrls: { default: { http: [localRpc] } },
      nativeCurrency,
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
  } as any

  return createConfig(configOptions)
}

export default createWagmiConfig
