import { ChangeEvent, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_MNEMONIC_INDEX } from '../../../../../../constants/constants'
import Typography from '../../../../../Typography/Typography'
import StepOptions from '../../../../CreateValidatorView/StepOptions'

export interface ImportedMnemonicIndexProps {
  mnemonicIndex: string | undefined
  onSetIndex: (index: string | undefined) => void
  onNextStep: () => void
  onBackStep: () => void
}

const ImportedMnemonicIndex: FC<ImportedMnemonicIndexProps> = ({
  mnemonicIndex,
  onSetIndex,
  onBackStep,
  onNextStep,
}) => {
  const { t } = useTranslation()

  const handleIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSetIndex(event.target.value)
  }

  return (
    <div className='py-8'>
      <div>
        <Typography type='text-caption1'>
          {t('validatorManagement.mnemonicIndexing.title')} --
        </Typography>
        <Typography type='text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.mnemonicIndexing.subTitle')}
        </Typography>
      </div>
      <div className='flex w-full max-w-[450px]'>
        <input
          onChange={handleIndexChange}
          min={0}
          value={mnemonicIndex}
          max={MAX_MNEMONIC_INDEX}
          className='w-full text-dark900 dark:text-dark300 dark:bg-dark600_20 font-openSauce text-caption1 p-2 outline-none border-style'
          type='number'
        />
      </div>
      <StepOptions
        onBackStep={onBackStep}
        onNextStep={onNextStep}
        isDisabledNext={!mnemonicIndex}
      />
    </div>
  )
}

export default ImportedMnemonicIndex
