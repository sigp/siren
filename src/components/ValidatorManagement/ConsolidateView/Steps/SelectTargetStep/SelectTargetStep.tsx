import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ValidatorInfo } from '../../../../../types/validator'
import FlexedOverflow from '../../../../FlexedOverflow/FlexedOverflow'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../../CreateValidatorView/StepOptions'
import SelectTargetRow from './SelectTargetRow'

export interface SelectTargetStepProps {
  validators: ValidatorInfo[]
  targetValidator: ValidatorInfo | undefined
  onSelect: (validator: ValidatorInfo) => void
  onNext: () => void
}

const SelectTargetStep: FC<SelectTargetStepProps> = ({
  validators,
  targetValidator,
  onSelect,
  onNext,
}) => {
  const { t } = useTranslation()

  return (
    <div className='w-full h-full flex flex-col items-center pt-6'>
      <div className='max-w-[520px] flex flex-col h-full space-y-6 w-full'>
        <div className='space-y-1'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectTarget.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectTarget.text')}
          </Typography>
        </div>
        <div className='flex-1 flex flex-col space-y-4'>
          <div className='w-full max-h-[45vh] flex-1 flex flex-col border-style rounded'>
            <div className='w-full py-2 px-4 border-b-style'>
              <Typography>{t('validators')}</Typography>
            </div>
            <FlexedOverflow>
              {validators.map((validator) => (
                <SelectTargetRow
                  isActive={!!targetValidator && targetValidator.pubKey === validator.pubKey}
                  key={validator.pubKey}
                  onSelect={onSelect}
                  validator={validator}
                />
              ))}
            </FlexedOverflow>
          </div>
          <StepOptions onNextStep={onNext} isDisabledNext={!targetValidator} />
        </div>
      </div>
    </div>
  )
}

export default SelectTargetStep
