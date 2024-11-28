import axios from 'axios'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { contractAbi } from '../../contracts/depositContractAbi'
import { ActivityType, ValidatorCandidate } from '../types'
import { BeaconNodeSpecResults } from '../types/beacon'
import useLodestarDepositData, { KeyStoreData } from './useLodestarDepositData'

export type ValidatorDepositConfig = {
  validator: ValidatorCandidate
  mnemonic: string
  beaconSpec: BeaconNodeSpecResults
}

export type ValidatorDepositReturnType = {
  isLoading: boolean
  error: string
  keyStore: KeyStoreData | undefined
  pubKey: string
  txHash: string
  makeDeposit: () => Promise<void>
}

const useValidatorDeposit = ({
  validator,
  mnemonic,
  beaconSpec,
}: ValidatorDepositConfig): ValidatorDepositReturnType => {
  const { MIN_ACTIVATION_BALANCE, DEPOSIT_CONTRACT_ADDRESS, GENESIS_FORK_VERSION } = beaconSpec
  const { index, withdrawalCredentials, keyStorePassword } = validator
  const [txHash, setTxHash] = useState<string>('')
  const [pubKey, setPubKey] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { writeContract } = useWriteContract()
  const [keyStore, setKeyStore] = useState<KeyStoreData>()
  const { generateDepositData, generateKeystore } = useLodestarDepositData(GENESIS_FORK_VERSION)

  const handleDepositError = (e) => {
    const error = (e as Error).message.toLowerCase()
    let errorMessage = 'error.unexpectedDepositError'
    if (error.includes('user rejected the request')) {
      errorMessage = 'error.userRejectedTransaction'
    }

    console.error(e)

    setError(errorMessage)
  }

  const makeDeposit = async () => {
    setLoading(true)

    try {
      const ethAmount = parseUnits(MIN_ACTIVATION_BALANCE, 'gwei')
      const { pubkey, withdrawal_credentials, signature, deposit_data_root } =
        await generateDepositData(
          mnemonic,
          Number(index),
          String(withdrawalCredentials),
          Number(MIN_ACTIVATION_BALANCE),
        )
      const keyStore = await generateKeystore(mnemonic, Number(index), keyStorePassword)

      writeContract(
        {
          address: DEPOSIT_CONTRACT_ADDRESS,
          abi: contractAbi,
          functionName: 'deposit',
          args: [pubkey, withdrawal_credentials, signature, deposit_data_root],
          value: ethAmount,
        },
        {
          onError: (e) => {
            setLoading(false)
            handleDepositError(e)
          },
          onSuccess: async (data) => {
            setTxHash(data)
            setKeyStore(keyStore)
            setPubKey(pubkey)
            try {
              await axios.post('/api/log-activity', {
                data: JSON.stringify({
                  amount: ethAmount.toString(),
                  txHash: data,
                }),
                type: ActivityType.DEPOSIT,
                pubKey: pubkey,
              })
            } catch (e) {
              console.error(e, 'error storing activity')
            }
          },
        },
      )
    } catch (e) {
      handleDepositError(e)
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return {
    isLoading,
    error,
    keyStore,
    pubKey,
    txHash,
    makeDeposit,
  }
}

export default useValidatorDeposit
