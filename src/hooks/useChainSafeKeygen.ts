import { SecretKey, PublicKey } from '@chainsafe/bls/herumi'
import { IBls } from '@chainsafe/bls/types'
import { deriveChildSK } from '@chainsafe/bls-hd-key'
import { deriveKeyFromMnemonic } from '@chainsafe/bls-keygen'
import { useCallback } from 'react'

export type DeriveValidatorKeysReturnType = {
  secretKey: SecretKey
  publicKey: PublicKey
}

export type useChainSafeKeygenReturnType = {
  deriveEIP2334SubKey: (mnemonic: string) => Uint8Array
  deriveValidatorSigningKey: (masterSK: Uint8Array, index: number) => DeriveValidatorKeysReturnType
  generateSigningPubKey: (eip2334SubKey: Uint8Array, index: number) => string
}

const useChainSafeKeygen = (bls: IBls | undefined): useChainSafeKeygenReturnType => {
  const deriveEIP2334SubKey = useCallback((mnemonic: string): Uint8Array => {
    try {
      const masterSK = deriveKeyFromMnemonic(mnemonic)
      return deriveChildSK(deriveChildSK(masterSK, 12381), 3600)
    } catch (e) {
      throw e
    }
  }, [])

  const deriveValidatorSigningKey = useCallback(
    (eip2334SubKey: Uint8Array, index: number): DeriveValidatorKeysReturnType => {
      if (index < 0) {
        throw new Error('NON_NEGATIVE_NUMBER')
      }

      if (index > 4294967295) {
        throw new Error('TOO_LARGE_INDEX')
      }

      if (!bls) {
        throw new Error('BLS_MODULE_NOT_FOUND')
      }

      try {
        const signingKeyBytes = deriveChildSK(
          deriveChildSK(deriveChildSK(eip2334SubKey, index), 0),
          0,
        )
        const signingKey = bls.SecretKey.fromBytes(signingKeyBytes)

        return {
          secretKey: signingKey,
          publicKey: signingKey.toPublicKey(),
        } as DeriveValidatorKeysReturnType
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    [bls],
  )

  const generateSigningPubKey = useCallback((eip2334SubKey: Uint8Array, index: number): string => {
    try {
      const { publicKey } = deriveValidatorSigningKey(eip2334SubKey, index)
      return publicKey.toHex()
    } catch (e) {
      console.error(e)
      throw e
    }
  }, [])

  return {
    deriveEIP2334SubKey,
    deriveValidatorSigningKey,
    generateSigningPubKey,
  }
}

export default useChainSafeKeygen
