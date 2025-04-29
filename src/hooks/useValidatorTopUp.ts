import { ByteVectorType, ContainerType, UintNumberType } from '@chainsafe/ssz'
import axios from 'axios'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { bytesToHex } from 'viem'
import { useWriteContract } from 'wagmi'
import { contractAbi } from '../../contracts/depositContractAbi'
import { beaconNodeSpec } from '../recoil/atoms'
import { ActivityType, TxHash } from '../types'

// DepositData SSZ type
export const depositDataContainer = new ContainerType({
  pubkey: new ByteVectorType(48), // 48-byte BLS pubkey
  withdrawalCredentials: new ByteVectorType(32), // 32-byte withdrawal creds
  amount: new UintNumberType(8), // 8-byte uint, JS number
  signature: new ByteVectorType(96), // 96-byte BLS signature
})

const useValidatorTopUp = () => {
  const beaconSpec = useRecoilValue(beaconNodeSpec)
  const [txHash, setTxHash] = useState<TxHash | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { writeContract } = useWriteContract()

  const handleDepositError = (e: any) => {
    const error = (e as Error).message
    let errorMessage = 'error.unexpectedDepositError'
    if (error.toLowerCase().includes('user rejected the request')) {
      errorMessage = 'error.userRejectedTransaction'
    }

    if (error.includes('INVALID_ADDRESS_LENGTH')) {
      errorMessage = 'error.invalidAddressLength'
    }

    if (error.includes('BEACON_SPEC_NOT_FOUND')) {
      errorMessage = 'error.beaconSpecNotFound'
    }

    setError(errorMessage)
  }

  const makeDeposit = async (pubKey: string, amount: bigint) => {
    setIsLoading(true)
    setError('')

    try {
      if (!beaconSpec) {
        throw new Error('BEACON_SPEC_NOT_FOUND')
      }

      const { DEPOSIT_CONTRACT_ADDRESS } = beaconSpec

      const defaultedCredentials = new Uint8Array(32)
      const defaultedSignature = new Uint8Array(96)
      const byteRoot = depositDataContainer.hashTreeRoot({
        pubkey: Uint8Array.from(Buffer.from(pubKey.slice(2), 'hex')),
        withdrawalCredentials: defaultedCredentials,
        amount: Number(amount / 1000000000n),
        signature: defaultedSignature,
      })
      const reconstructedDepositDataRoot = bytesToHex(byteRoot)

      writeContract(
        {
          address: DEPOSIT_CONTRACT_ADDRESS as TxHash,
          abi: contractAbi,
          functionName: 'deposit',
          args: [
            pubKey,
            bytesToHex(defaultedCredentials),
            bytesToHex(defaultedSignature),
            reconstructedDepositDataRoot,
          ],
          value: amount,
        },
        {
          onError: (e) => {
            setIsLoading(false)
            handleDepositError(e)
            console.error(e)
          },
          onSuccess: async (data) => {
            setTxHash(data as TxHash)
            try {
              await axios.post('/api/log-activity', {
                data: JSON.stringify({
                  amount: amount.toString(),
                  txHash: data,
                }),
                type: ActivityType.DEPOSIT,
                pubKey,
              })
              setIsLoading(false)
            } catch (e) {
              console.error(e, 'error storing activity')
            }
          },
        },
      )
    } catch (e) {
      handleDepositError(e)
      setIsLoading(false)
      console.error(e)
    }
  }

  const retryTransaction = () => {
    setError('')
    setTxHash(undefined)
  }

  return {
    txHash,
    isLoading,
    error,
    makeDeposit,
    retryTransaction,
  }
}

export default useValidatorTopUp
