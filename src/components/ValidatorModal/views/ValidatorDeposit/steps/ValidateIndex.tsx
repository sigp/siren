import { debounce } from 'lodash'
import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { MAX_MNEMONIC_INDEX } from '../../../../../constants/constants'
import useChainSafeKeygen from '../../../../../hooks/useChainSafeKeygen'
import { blsModuleAtom } from '../../../../../recoil/atoms'
import Input from '../../../../Input/Input'
import Spinner from '../../../../Spinner/Spinner'
import Typography from '../../../../Typography/Typography'

export interface ValidateIndexProps {
  mnemonic: string | null
  pubKey: string
  onVerifyIndex: (index: number) => void
}

const ValidateIndex: FC<ValidateIndexProps> = ({ mnemonic, pubKey, onVerifyIndex }) => {
  const { t } = useTranslation()
  const blsModule = useRecoilValue(blsModuleAtom)
  const [isPromptIndex, setIsPromptIndex] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const [isValidIndex, setIsValidIndex] = useState(false)
  const [mnemonicIndex, setMnemonicIndex] = useState<number | null>(null)
  const { generateSigningPubKey, deriveEIP2334SubKey } = useChainSafeKeygen(blsModule)

  useEffect(() => {
    if (!mnemonic) return
    const maxTryCount = 10

    setTimeout(() => {
      ;(() => {
        try {
          const eip2334SubKey = deriveEIP2334SubKey(mnemonic)
          for (let index = 0; index <= maxTryCount; index++) {
            const key = generateSigningPubKey(eip2334SubKey, index)
            if (key === pubKey) {
              onVerifyIndex(index)
              break
            }

            if (index === maxTryCount) {
              setIsPromptIndex(true)
            }
          }
        } catch (e) {
          console.error(e)
        }
      })()
    }, 1500)
  }, [mnemonic, pubKey])

  const verifyIndex = useCallback(
    (index: number) => {
      if (!mnemonic) return

      const eip2334SubKey = deriveEIP2334SubKey(mnemonic)
      const key = generateSigningPubKey(eip2334SubKey, index)
      setIsValidated(true)

      if (key === pubKey) {
        onVerifyIndex(index)
        setIsValidIndex(true)
      }
    },
    [mnemonic, pubKey],
  )

  const latestVerifyIndex = useRef(verifyIndex)
  useEffect(() => {
    latestVerifyIndex.current = verifyIndex
  }, [verifyIndex])

  const debouncedValidateIndexRef = useRef(
    debounce((index: number) => {
      void latestVerifyIndex.current(index)
    }, 1000),
  )

  useEffect(() => {
    if (mnemonicIndex === null) return

    debouncedValidateIndexRef.current(mnemonicIndex)
  }, [mnemonicIndex])

  const setIndex = (e: ChangeEvent<HTMLInputElement>) => {
    const index = e.target.value
    setIsValidated(false)
    setIsValidIndex(false)
    setMnemonicIndex(index ? Number(index) : null)
  }

  return (
    <div className='px-2 py-4'>
      {isPromptIndex ? (
        <div className='space-y-2'>
          <Typography type='text-caption1'>
            {t('validatorManagement.partialDeposit.mnemonicIndexHelperText')}
          </Typography>
          <div className='relative'>
            <Input
              inputStyle='basic_border'
              isErrorBorder={isValidated && !isValidIndex}
              onChange={setIndex}
              min={0}
              max={MAX_MNEMONIC_INDEX}
              type='number'
            />
            {!isValidated && !isValidIndex && mnemonicIndex && (
              <div className='absolute top-1/2 -translate-y-1/2 right-1'>
                <Spinner size='h-4 w-4' />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='flex items-center space-x-2'>
          <Typography type='text-caption1'>
            {t('validatorManagement.partialDeposit.deriveIndexHelperText')}
          </Typography>
          <Spinner size='h-4 w-4' />
        </div>
      )}
    </div>
  )
}

export default ValidateIndex
