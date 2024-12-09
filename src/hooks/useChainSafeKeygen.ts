import { SecretKey, PublicKey } from '@chainsafe/bls/herumi'
import { deriveEth2ValidatorKeys, deriveKeyFromMnemonic } from '@chainsafe/bls-keygen'

export type DeriveValidatorKeysReturnType = {
  secretKey: SecretKey
  publicKey: PublicKey
}

export type useChainSafeKeygenReturnType = {
  deriveValidatorKeys: (mnemonic: string, index: number) => Promise<DeriveValidatorKeysReturnType>
  generatePubKey: (mnemonic: string, index: number) => Promise<string>
}

const useChainSafeKeygen = (): useChainSafeKeygenReturnType => {

  const deriveValidatorKeys = async (
    mnemonic: string,
    index: number,
  ): Promise<DeriveValidatorKeysReturnType> => {
    if (index < 0) {
      throw new Error('NON_NEGATIVE_NUMBER')
    }

    if (index > 4294967295) {
      throw new Error('TOO_LARGE_INDEX')
    }

    try {
      const bls = await import('@chainsafe/bls/herumi')
      const masterSK = deriveKeyFromMnemonic(mnemonic)
      const secretKey = bls.SecretKey.fromBytes(deriveEth2ValidatorKeys(masterSK, index).signing)

      return {
        secretKey,
        publicKey: secretKey.toPublicKey(),
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const generatePubKey = async (mnemonic: string, index: number): Promise<string> => {
    try {
      const { publicKey } = await deriveValidatorKeys(mnemonic, index)
      return publicKey.toHex()
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  return {
    deriveValidatorKeys,
    generatePubKey,
  }
}

export default useChainSafeKeygen
