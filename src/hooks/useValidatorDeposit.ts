import axios from 'axios'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { contractAbi } from '../../contracts/depositContractAbi'
import { ActivityType, TxHash, ValidatorCandidate } from '../types'
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
  txHash: TxHash | undefined
  makeDeposit: () => Promise<void>
}

const useValidatorDeposit = ({
  validator,
  mnemonic,
  beaconSpec,
}: ValidatorDepositConfig): ValidatorDepositReturnType => {
  const { MIN_ACTIVATION_BALANCE, DEPOSIT_CONTRACT_ADDRESS, GENESIS_FORK_VERSION } = beaconSpec
  const { index, withdrawalCredentials, keyStorePassword } = validator
  const [txHash, setTxHash] = useState<TxHash | undefined>()
  const [pubKey, setPubKey] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { writeContract } = useWriteContract()
  const [keyStore, setKeyStore] = useState<KeyStoreData>()
  const { generateDepositData, generateKeystore } = useLodestarDepositData(GENESIS_FORK_VERSION)

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
      if (!keyStorePassword) {
        throw new Error('MISSING_KEYSTORE_PASSWORD')
      }

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
          address: DEPOSIT_CONTRACT_ADDRESS as TxHash,
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
            setTxHash(data as TxHash)
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
    keyStore,
    pubKey,
    txHash,
    makeDeposit,
  }
}

export default useValidatorDeposit
