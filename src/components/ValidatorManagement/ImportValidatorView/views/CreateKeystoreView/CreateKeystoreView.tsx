import { ChangeEvent, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { blsModuleAtom } from '../../../../../recoil/atoms'
import HorizontalStepper from '../../../../HorizontalStepper/HorizontalStepper'
import Spinner from '../../../../Spinner/Spinner'
import MnemonicPhrase from '../../../CreateValidatorView/Steps/MnemonicPhrase'
import ConfirmImport from './steps/ConfirmImport'
import ImportedKeystoreAuthentication from './steps/ImportedKeystoreAuthentication'
import ImportedMnemonicIndex from './steps/ImportedMnemonicIndex'
import ImportSuggestedFee from './steps/ImportSuggestedFee'

const CreateKeystoreView = () => {
  const blsModule = useRecoilValue(blsModuleAtom)
  const [keyStoreAuth, setKeyStoreAuth] = useState<string | undefined>('')
  const [suggestedFee, setSuggestedFee] = useState<string | undefined>('')
  const [keyPhrase, setKeyPhrase] = useState<string | undefined>('')
  const [mnemonicIndex, setIndex] = useState<string | undefined>('')

  const setCredential = (value: string | undefined) => setSuggestedFee(value)
  const steps = ['Enter Mnemonic', 'Set Index', 'Set Authentication', 'Set Fee Recipient', 'Upload']

  const setPhrase = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setKeyPhrase(e.target.value)
  }, [])

  const onIndexChange = (index: string | undefined) => {
    setIndex(index)
  }

  const onStoreKeyStoreAuth = (value: string | undefined) => setKeyStoreAuth(value)

  return blsModule ? (
    <HorizontalStepper steps={steps}>
      {({ incrementStep, decrementStep, step }) =>
        (
          <>
            <div className='py-8'>
              <MnemonicPhrase
                isActive={step === 0}
                onNextStep={incrementStep}
                value={keyPhrase}
                onChange={setPhrase}
                blsModule={blsModule}
              />
            </div>
            <ImportedMnemonicIndex
              onNextStep={incrementStep}
              onBackStep={decrementStep}
              onSetIndex={onIndexChange}
              mnemonicIndex={mnemonicIndex}
            />
            <ImportedKeystoreAuthentication
              onStoreAuth={onStoreKeyStoreAuth}
              onNextStep={incrementStep}
              onBackStep={decrementStep}
            />
            <ImportSuggestedFee
              address={suggestedFee}
              onSetAddress={setCredential}
              onNextStep={incrementStep}
              onBackStep={decrementStep}
            />
            {!!mnemonicIndex && !!keyPhrase ? (
              <ConfirmImport
                blsModule={blsModule}
                suggestedFeeRecipient={suggestedFee}
                password={keyStoreAuth}
                index={mnemonicIndex}
                keyPhrase={keyPhrase}
              />
            ) : null}
          </>
        ) as any
      }
    </HorizontalStepper>
  ) : (
    <div className='w-full h-full flex items-center justify-center'>
      <Spinner />
    </div>
  )
}

export default CreateKeystoreView
