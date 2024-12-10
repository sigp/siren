import { useMemo } from 'react'
import { useConnect } from 'wagmi'
import { UseConnectReturnType } from 'wagmi/src/hooks/useConnect'

const useWalletConnectors = (): UseConnectReturnType => {
  const { connectors, ...props } = useConnect()

  return {
    connectors: useMemo(() => {
      return connectors
        ? Array.from(
            new Map(
              connectors
                .filter((item) => item?.name?.toLowerCase() !== 'walletconnect')
                .map((item) => [item?.name, item]),
            ).values(),
          )
        : []
    }, [connectors]),
    ...props,
  }
}

export default useWalletConnectors
