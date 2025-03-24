import { fromHexString, toHexString, Type } from '@chainsafe/ssz'
import { DOMAIN_DEPOSIT } from '@lodestar/params'
import { DomainType, Domain, Root, Version } from '@lodestar/types'
import { ssz } from '@lodestar/types/phase0'
import { getAddress, getBytes } from 'ethers'
import { useRecoilValue } from 'recoil'
import { WalletPrefix } from '../constants/enums'
import { blsModuleAtom } from '../recoil/atoms'
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

export type useLodestarDepositDataReturnType = {
  generateDepositData: (
    mnemonic: string,
    index: number,
    withdrawalAddress: string,
    amount: number,
    prefix: WalletPrefix,
  ) => Promise<DepositData>
}

const useLodestarDepositData = (genesisForkVersion: string): useLodestarDepositDataReturnType => {
  const blsModule = useRecoilValue(blsModuleAtom)
  const { deriveValidatorSigningKey, deriveEIP2334SubKey } = useChainSafeKeygen(blsModule)

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

  const generateWithdrawalCredentials = (
    withdrawalAddress: string,
    prefix: WalletPrefix,
  ): Uint8Array => {
    const checkSumAddress = getAddress(withdrawalAddress)
    const addressBytes = fromHexString(checkSumAddress.replace('0x', ''))

    if (addressBytes.length !== 20) {
      throw new Error('INVALID_ADDRESS_LENGTH')
    }

    const withdrawalCredentials = new Uint8Array(32)

    withdrawalCredentials[0] = prefix

    withdrawalCredentials.set(addressBytes, 12)

    return withdrawalCredentials
  }

  const generateDepositData = async (
    mnemonic: string,
    index: number,
    withdrawalAddress: string,
    amount: number,
    prefix = WalletPrefix.ONE,
  ): Promise<DepositData> => {
    try {
      const eip2334SubKey = deriveEIP2334SubKey(mnemonic)
      const { secretKey, publicKey } = deriveValidatorSigningKey(eip2334SubKey, index)

      const withdrawalCredentials = generateWithdrawalCredentials(withdrawalAddress, prefix)

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
  }
}

export default useLodestarDepositData
