import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'
import { mainnet, holesky } from 'wagmi/chains'

const localChainId = process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID
const localRpc = process.env.NEXT_PUBLIC_TESTNET_RPC

const createWagmiConfig = () => {
  let customLocalhost

  if (localChainId && localRpc) {
    customLocalhost = defineChain({
      id: Number(localChainId),
      name: 'Localhost',
      network: 'localhost',
      rpcUrls: {
        default: { http: [localRpc] },
      },
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      testnet: true,
    } as any)
  }

  const mekongTestnet = defineChain({
    id: 7078815900,
    name: 'Mekong',
    network: 'mekong',
    rpcUrls: {
      default: { http: ['https://rpc.mekong.ethpandaops.io/'] },
    },
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    testnet: true,
  } as any)

  const chains = [mainnet, holesky, mekongTestnet] as any
  const transports = {
    [mainnet.id]: http(),
    [holesky.id]: http(),
    [mekongTestnet.id]: http(),
  } as any

  if (customLocalhost !== undefined) {
    chains.push(customLocalhost as any)
    transports[customLocalhost.id] = http()
  }

  return createConfig({
    chains,
    ssr: true,
    transports,
  })
}

export default createWagmiConfig
