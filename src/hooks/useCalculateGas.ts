import { useEstimateGas, useGasPrice, UseEstimateGasParameters } from 'wagmi'

export interface useCalculateGasProps {
  chainId: number
  config: UseEstimateGasParameters
  extraFee?: bigint
}

export type useCalculateGasReturnType = {
  totalRequiredFunds: bigint
  estimatedGasLimit: bigint | null
}

const useCalculateGas = ({
  chainId,
  config,
  extraFee,
}: useCalculateGasProps): useCalculateGasReturnType => {
  const { data: gasPrice } = useGasPrice({ chainId })

  const { data: estimatedGasData } = useEstimateGas(config)

  const estimatedGasLimit = estimatedGasData
    ? (BigInt(estimatedGasData.toString()) * 110n) / 100n
    : null
  const gasFee = estimatedGasLimit && gasPrice ? estimatedGasLimit * gasPrice : 0n
  const totalRequiredFunds = (extraFee || 0n) + gasFee

  return {
    totalRequiredFunds,
    estimatedGasLimit,
  }
}

export default useCalculateGas
