import { IBls } from '@chainsafe/bls/types'
import { FC, useMemo } from 'react'
import useChainSafeKeygen from '../../../../../../hooks/useChainSafeKeygen'

export interface ConfirmImportProps {
  keyPhrase: string
  index: string
  password: string | undefined
  suggestedFeeRecipient: string | undefined
  blsModule: IBls
}

const ConfirmImport: FC<ConfirmImportProps> = ({
  keyPhrase,
  index,
  suggestedFeeRecipient,
  password,
  blsModule,
}) => {
  const { deriveEIP2334SubKey, generateSigningPubKey } = useChainSafeKeygen(blsModule)

  const eip2334SubKey = useMemo(() => {
    return deriveEIP2334SubKey(keyPhrase)
  }, [keyPhrase])

  const pubKey = useMemo(() => {
    return generateSigningPubKey(eip2334SubKey, Number(index))
  }, [index])

  return <div className='py-8'>{pubKey}</div>
}

export default ConfirmImport
