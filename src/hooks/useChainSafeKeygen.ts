import { SecretKey, PublicKey } from '@chainsafe/bls/herumi';
import { deriveEth2ValidatorKeys, deriveKeyFromMnemonic } from '@chainsafe/bls-keygen';
import { useState } from 'react';

export type DeriveValidatorKeysReturnType = {
  secretKey: SecretKey,
  publicKey: PublicKey
}

export type useChainSafeKeygenReturnType = {
  isLoading: boolean,
  deriveValidatorKeys: (mnemonic: string, index: number) => Promise<DeriveValidatorKeysReturnType>
  generatePubKey: (mnemonic: string, index: number) => Promise<string>
}

const useChainSafeKeygen = (): useChainSafeKeygenReturnType => {
  const [isLoading, setLoading] = useState<boolean>(false)

  const deriveValidatorKeys = async (mnemonic: string, index: number): Promise<DeriveValidatorKeysReturnType> => {
    if (index < 0) {
      throw new Error("NON_NEGATIVE_NUMBER");
    }

    if(index > 4294967295) {
      throw new Error("TOO_LARGE_INDEX");
    }

    setLoading(true)

    try {
      const bls = await import("@chainsafe/bls/herumi");
      const masterSK = deriveKeyFromMnemonic(mnemonic);
      const secretKey = bls.SecretKey.fromBytes(deriveEth2ValidatorKeys(masterSK, index).signing);

      return {
        secretKey,
        publicKey: secretKey.toPublicKey()
      };
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const generatePubKey = async (mnemonic: string, index: number): Promise<string> => {
    setLoading(true)
    try {
      const { publicKey } = await deriveValidatorKeys(mnemonic, index)
      return publicKey.toHex()
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return {
    isLoading,
    deriveValidatorKeys,
    generatePubKey
  }
}

export default useChainSafeKeygen