import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import useAnimatedListControls from '../../../../../hooks/useAnimatedListControls'
import { useMaxHeight } from '../../../../../hooks/useMaxHeight'
import { ValidatorInfo } from '../../../../../types/validator'
import NoEligibleValidatorsFound from '../../../../EmptyState/NoEligibleValidatorsFound'
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
  const { controls } = useAnimatedListControls(isActive)
  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()

  const renderedRows = useMemo(() => {
    return validators.length ? (
      validators.map((validator, index) => (
        <SelectTargetRow
          animIndex={index}
          animControls={controls}
          isActive={!!targetValidator && targetValidator.pubKey === validator.pubKey}
          key={validator.pubKey}
          onSelect={onSelect}
          validator={validator}
        />
      ))
    ) : (
      <NoEligibleValidatorsFound />
    )
  }, [validators, targetValidator, onSelect, controls])

  return (
    <div className='w-full flex-1 flex flex-col items-center pt-6'>
      <div className='max-w-[620px] flex-1 flex flex-col space-y-6 w-full'>
        <div className='space-y-1'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectTarget.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectTarget.text')}
          </Typography>
        </div>
        <div ref={parentRef} className='space-y-4 flex-1'>
          <div
            ref={targetChildRef}
            style={{ maxHeight: maxHeight }}
            className='w-full flex-1 flex flex-col border-style rounded'
          >
            <div className='w-full py-2 flex items-center space-x-2 px-4 border-b-style'>
              <div className='w-4 h-4'>
                <ValidatorLogo className='text-black dark:text-dark500' />
              </div>
              <Typography>{t('validators')}</Typography>
            </div>
            <div className='h-full overflow-auto'>{renderedRows}</div>
          </div>
          <StepOptions onNextStep={onNext} isDisabledNext={!targetValidator} />
        </div>
      </div>
    </div>
  )
}

export default SelectTargetStep
