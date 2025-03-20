import axios from 'axios'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { contractAbi } from '../../contracts/depositContractAbi'
import { ActivityType, TxHash, ValidatorCandidate } from '../types'
import { BeaconNodeSpecResults } from '../types/beacon'
import useLodestarDepositData from './useLodestarDepositData'

export type ValidatorDepositConfig = {
  validator: ValidatorCandidate
  mnemonic: string
  beaconSpec: BeaconNodeSpecResults
}

export type ValidatorDepositReturnType = {
  isLoading: boolean
  error: string
  pubKey: string
  txHash: TxHash | undefined
  makeDeposit: () => Promise<void>
}

const useValidatorDeposit = ({
  validator,
  mnemonic,
  beaconSpec,
}: ValidatorDepositConfig): ValidatorDepositReturnType => {
  const { DEPOSIT_CONTRACT_ADDRESS, GENESIS_FORK_VERSION } = beaconSpec
  const { index, withdrawalCredentials, effectiveBalance, withdrawalPrefix } = validator
  const [txHash, setTxHash] = useState<TxHash | undefined>()
  const [pubKey, setPubKey] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { writeContract } = useWriteContract()
  const { generateDepositData } = useLodestarDepositData(GENESIS_FORK_VERSION)

  const handleDepositError = (e: any) => {
    const error = (e as Error).message
    let errorMessage = 'error.unexpectedDepositError'
    if (error.toLowerCase().includes('user rejected the request')) {
      errorMessage = 'error.userRejectedTransaction'
    }

    if (error.includes('INVALID_ADDRESS_LENGTH')) {
      errorMessage = 'error.invalidAddressLength'
    }

    setError(errorMessage)
  }

  const makeDeposit = async () => {
    setLoading(true)
    setError('')

    try {
      const { pubkey, withdrawal_credentials, signature, deposit_data_root } =
        await generateDepositData(
          mnemonic,
          Number(index),
          String(withdrawalCredentials),
          Number(effectiveBalance / 1000000000n),
          withdrawalPrefix,
        )

      writeContract(
        {
          address: DEPOSIT_CONTRACT_ADDRESS as TxHash,
          abi: contractAbi,
          functionName: 'deposit',
          args: [pubkey, withdrawal_credentials, signature, deposit_data_root],
          value: effectiveBalance,
        },
        {
          onError: (e) => {
            setLoading(false)
            handleDepositError(e)
          },
          onSuccess: async (data) => {
            setTxHash(data as TxHash)
            setPubKey(pubkey)
            try {
              await axios.post('/api/log-activity', {
                data: JSON.stringify({
                  amount: effectiveBalance.toString(),
                  txHash: data,
                }),
                type: ActivityType.DEPOSIT,
                pubKey: pubkey,
              })
              setLoading(false)
            } catch (e) {
              console.error(e, 'error storing activity')
            }
          },
        },
      )
    } catch (e) {
      handleDepositError(e)
      setLoading(false)
      console.log(e)
    }
  }

  return {
    isLoading,
    error,
    pubKey,
    txHash,
    makeDeposit,
  }
}

export default useValidatorDeposit
