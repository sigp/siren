import { useMemo } from 'react'
import { useConnect } from 'wagmi'
import type { UseConnectReturnType } from 'wagmi'

const useWalletConnectors = (): UseConnectReturnType => {
  const { connectors, ...connectProps } = useConnect()

  const uniqueConnectors = useMemo(() => {
    if (!connectors) return []

    const connectorMap = new Map<string, (typeof connectors)[number]>()
    connectors.forEach((connector) => {
      if (connector?.name && !connectorMap.has(connector.name)) {
        connectorMap.set(connector.name, connector)
      }
    })

    return Array.from(connectorMap.values())
  }, [connectors])

  return { connectors: uniqueConnectors, ...connectProps }
}

export default useWalletConnectors
