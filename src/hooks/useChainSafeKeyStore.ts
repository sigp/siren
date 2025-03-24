import { create, IKeystore } from '@chainsafe/bls-keystore'
import { useRecoilValue } from 'recoil'
import { blsModuleAtom } from '../recoil/atoms'
import useChainSafeKeygen from './useChainSafeKeygen'

export interface KeyStoreData {
  enable: boolean
  password: string
  keystore: IKeystore
}

export type useChainSafeKeyStoreReturnType = {
  generateKeystore: (
    mnemonic: string,
    index: number,
    keyStorePassword: string,
    keyDerivationPath?: string,
  ) => Promise<KeyStoreData>
}

const useChainSafeKeyStore = (): useChainSafeKeyStoreReturnType => {
  const blsModule = useRecoilValue(blsModuleAtom)
  const { deriveValidatorSigningKey, deriveEIP2334SubKey } = useChainSafeKeygen(blsModule)

  const generateKeystore = async (
    mnemonic: string,
    index: number,
    keyStorePassword: string,
  ): Promise<KeyStoreData> => {
    try {
      const eip2334SubKey = deriveEIP2334SubKey(mnemonic)
      const { secretKey, publicKey } = deriveValidatorSigningKey(eip2334SubKey, index)
      const keystore = await create(
        keyStorePassword,
        secretKey.toBytes(),
        publicKey.toBytes(),
        `m/12381/3600/${index}/0/0`,
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

  return {
    generateKeystore,
  }
}

export default useChainSafeKeyStore
