import { create, IKeystore } from '@chainsafe/bls-keystore'
import { fromHexString, toHexString, Type } from '@chainsafe/ssz'
import { DOMAIN_DEPOSIT } from '@lodestar/params'
import { DomainType, Domain, Root, Version } from '@lodestar/types'
import { ssz } from '@lodestar/types/phase0'
import { getAddress, getBytes } from 'ethers'
import useChainSafeKeygen from './useChainSafeKeygen'

interface DepositDataJson {
  amount: number
  pubkey: string
  signature: string
  withdrawal_credentials: string
}

interface DepositData extends DepositDataJson {
  deposit_data_root: string
}

export interface KeyStoreData {
  enable: boolean
  password: string
  keystore: IKeystore
}

export type useLodestarDepositDataReturnType = {
  generateDepositData: (
    mnemonic: string,
    index: number,
    withdrawalAddress: string,
    amount: number,
  ) => Promise<DepositData>
  generateKeystore: (
    mnemonic: string,
    index: number,
    keyStorePassword: string,
    keyDerivationPath?: string,
  ) => Promise<KeyStoreData>
}

const useLodestarDepositData = (genesisForkVersion: string): useLodestarDepositDataReturnType => {
  const { deriveValidatorKeys } = useChainSafeKeygen()

  const computeForkDataRoot = (currentVersion: Version, genesisValidatorsRoot: Root) => {
    const forkData = {
      currentVersion,
      genesisValidatorsRoot,
    }
    return ssz.ForkData.hashTreeRoot(forkData)
  }

  const computeDomain = (
    domainType: DomainType,
    forkVersion: Version,
    genesisValidatorRoot: Root,
  ) => {
    const forkDataRoot = computeForkDataRoot(forkVersion, genesisValidatorRoot)
    const domain = new Uint8Array(32)
    domain.set(domainType, 0)
    domain.set(forkDataRoot.slice(0, 28), 4)
    return domain
  }

  const computeSigningRoot = <T>(type: Type<T>, sszObject: T, domain: Domain) => {
    const domainWrappedObject = {
      objectRoot: type.hashTreeRoot(sszObject),
      domain,
    }
    return ssz.SigningData.hashTreeRoot(domainWrappedObject)
  }

  const generateKeystore = async (
    mnemonic: string,
    index: number,
    keyStorePassword: string,
  ): Promise<KeyStoreData> => {
    try {
      const { secretKey, publicKey } = await deriveValidatorKeys(mnemonic, index)
      const keystore = await create(
        keyStorePassword,
        secretKey.toBytes(),
        publicKey.toBytes(),
        'm/12381/3600/0/0/0',
      )

      return {
        enable: true,
        password: keyStorePassword,
        keystore,
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const generateWithdrawalCredentials = (withdrawalAddress: string): Uint8Array => {
    const checkSumAddress = getAddress(withdrawalAddress)
    const addressBytes = fromHexString(checkSumAddress.replace('0x', ''))

    if (addressBytes.length !== 20) {
      throw new Error('INVALID_ADDRESS_LENGTH')
    }

    const withdrawalCredentials = new Uint8Array(32)

    withdrawalCredentials[0] = 0x01

    withdrawalCredentials.set(addressBytes, 12)

    return withdrawalCredentials
  }

  const generateDepositData = async (
    mnemonic: string,
    index: number,
    withdrawalAddress: string,
    amount: number,
  ): Promise<DepositData> => {
    try {
      const { secretKey, publicKey } = await deriveValidatorKeys(mnemonic, index)

      const withdrawalCredentials = generateWithdrawalCredentials(withdrawalAddress)

      const depositMessage = { pubkey: publicKey.toBytes(), withdrawalCredentials, amount }

      const domain = computeDomain(
        DOMAIN_DEPOSIT,
        getBytes(genesisForkVersion),
        Buffer.alloc(32, 0),
      )
      const signingRoot = computeSigningRoot(ssz.DepositMessage, depositMessage, domain)
      const depositData = { ...depositMessage, signature: secretKey.sign(signingRoot).toBytes() }

      const depositDataRoot = ssz.DepositData.hashTreeRoot(depositData)

      return {
        ...(ssz.DepositData.toJson(depositData) as any),
        deposit_data_root: toHexString(depositDataRoot),
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  return {
    generateDepositData,
    generateKeystore,
  }
}

export default useLodestarDepositData
