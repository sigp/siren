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
    })
  }

  const chains = [mainnet, holesky]
  const transports = {
    [mainnet.id]: http(),
    [holesky.id]: http(),
  }

  if (customLocalhost) {
    chains.push(customLocalhost)
    transports[customLocalhost.id] = http()
  }

  return createConfig({
    chains,
    ssr: true,
    transports,
  })
}

export default createWagmiConfig
