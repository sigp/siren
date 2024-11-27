import { create, IKeystore } from '@chainsafe/bls-keystore';
import { fromHexString, toHexString } from '@chainsafe/ssz';
import { DOMAIN_DEPOSIT } from '@lodestar/params';
import { ssz } from '@lodestar/types/phase0';
import { isAddress, getBytes } from 'ethers';
import { useState } from 'react';
import useChainSafeKeygen from './useChainSafeKeygen';

interface DepositDataJson {
  amount: number;
  pubkey: string;
  signature: string;
  withdrawal_credentials: string;
}

interface DepositData extends DepositDataJson {
  deposit_data_root: string;
}

export interface KeyStoreData {
  enable: boolean,
  password: string,
  keystore: IKeystore
}

export type useLodestarDepositDataReturnType = {
  isLoading: boolean,
  generateDepositData: (mnemonic: string, index: number, withdrawalAddress: string, amount: number) => Promise<DepositData>
  generateKeystore: (mnemonic: string, index: number, keyStorePassword, keyDerivationPath?: string) => Promise<KeyStoreData>
}

const useLodestarDepositData = (genesisForkVersion: string): useLodestarDepositDataReturnType => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const { deriveValidatorKeys } = useChainSafeKeygen()

  const generateKeystore = async (mnemonic: string, index: number, keyStorePassword, keyDerivationPath = "m/12381/3600/0/0/0"): Promise<KeyStoreData> => {
    setLoading(true)

    try {
      const { secretKey, publicKey } = await deriveValidatorKeys(mnemonic, index)
      const keystore = await create(keyStorePassword, secretKey.toBytes(), publicKey.toBytes(), keyDerivationPath);

      return {
        enable: true,
        password: keyStorePassword,
        keystore
      }
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const generateDepositData = async (mnemonic: string, index: number, withdrawalAddress: string, amount: number): Promise<DepositData>  =>
  {
    if(!isAddress(withdrawalAddress)) {
      throw new Error("INVALID_ADDRESS")
    }

    setLoading(true)

    try {
      const { secretKey, publicKey } = await deriveValidatorKeys(mnemonic, index)

      const withdrawalCredentials = fromHexString("0x010000000000000000000000" + withdrawalAddress.replace("0x", ""));

      const depositMessage = { pubkey: publicKey.toBytes(), withdrawalCredentials, amount };

      const { ZERO_HASH, computeDomain, computeSigningRoot } = await import("@lodestar/state-transition")

      const domain = computeDomain(DOMAIN_DEPOSIT, getBytes(genesisForkVersion), ZERO_HASH);
      const signingRoot = computeSigningRoot(ssz.DepositMessage, depositMessage, domain);
      const depositData = { ...depositMessage, signature: secretKey.sign(signingRoot).toBytes() };

      const depositDataRoot = ssz.DepositData.hashTreeRoot(depositData);

      return {
        ...ssz.DepositData.toJson(depositData) as DepositDataJson,
        deposit_data_root: toHexString(depositDataRoot)
      }
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return {
    generateDepositData,
    generateKeystore,
    isLoading
  }
}

export default useLodestarDepositData