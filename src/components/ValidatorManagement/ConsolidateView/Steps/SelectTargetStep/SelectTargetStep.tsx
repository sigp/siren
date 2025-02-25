import { useAnimationControls } from 'framer-motion'
import { FC, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { ValidatorInfo } from '../../../../../types/validator'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../../CreateValidatorView/StepOptions'
import SelectTargetRow from './SelectTargetRow'

export interface SelectTargetStepProps {
  validators: ValidatorInfo[]
  targetValidator: ValidatorInfo | undefined
  onSelect: (validator: ValidatorInfo) => void
  onNext: () => void
  isActive: boolean
}

const SelectTargetStep: FC<SelectTargetStepProps> = ({
  validators,
  targetValidator,
  onSelect,
  onNext,
  isActive,
}) => {
  const { t } = useTranslation()
  const controls = useAnimationControls()

  useEffect(() => {
    if (isActive) {
      controls.stop()
      const baseAnim = {
        y: 0,
        opacity: 100,
        transition: { duration: 0 },
      }
      controls.start((i) =>
        i < 10
          ? {
              ...baseAnim,
              transition: { duration: 0.2, delay: i * 0.1 },
            }
          : baseAnim,
      )
    }
  }, [isActive, controls])

  const renderedRows = useMemo(() => {
    return validators.map((validator, index) => (
      <SelectTargetRow
        animIndex={index}
        animControls={controls}
        isActive={!!targetValidator && targetValidator.pubKey === validator.pubKey}
        key={validator.pubKey}
        onSelect={onSelect}
        validator={validator}
      />
    ))
  }, [validators, targetValidator, onSelect, controls])

  return (
    <div className='w-full flex flex-col items-center pt-6'>
      <div className='max-w-[620px] flex flex-col space-y-6 w-full'>
        <div className='space-y-1'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectTarget.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectTarget.text')}
          </Typography>
        </div>
        <div className='space-y-4'>
          <div className='w-full max-h-[45vh] flex-1 flex flex-col border-style rounded'>
            <div className='w-full py-2 flex items-center space-x-2 px-4 border-b-style'>
              <div className='w-4 h-4'>
                <ValidatorLogo className='text-black dark:text-dark500' />
              </div>
              <Typography>{t('validators')}</Typography>
            </div>
            <div className='h-full max-h-[448px] overflow-scroll'>{renderedRows}</div>
          </div>
          <StepOptions onNextStep={onNext} isDisabledNext={!targetValidator} />
        </div>
      </div>
    </div>
  )
}

export default SelectTargetStep
