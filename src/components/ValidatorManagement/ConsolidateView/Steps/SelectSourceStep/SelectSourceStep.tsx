import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import { ValidatorInfo } from '../../../../../types/validator'
import CheckBox from '../../../../CheckBox/CheckBox'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../../CreateValidatorView/StepOptions'
import SelectionDisplay from './SelectionDisplay'
import SelectSourceRow from './SelectSourceRow'

export interface SelectSourceStepProps {
  validators: ValidatorInfo[]
  targetValidator: ValidatorInfo | undefined
  onSelectTargetValidators: (validators: ValidatorInfo[]) => void
  onNext: () => void
  onBack: () => void
}

const SelectSourceStep: FC<SelectSourceStepProps> = ({
  validators,
  targetValidator,
  onSelectTargetValidators,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation()
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [isSelfConsolidate, setIsSelfConsolidate] = useState(false)
  const [selectedSources, setSelectedSources] = useState<ValidatorInfo[]>([])
  const canSelfConsolidate = targetValidator?.withdrawalAddress?.includes('0x01')

  const availableSourceValidators = useMemo<ValidatorInfo[]>(() => {
    return validators.filter(({ pubKey }) => pubKey !== targetValidator?.pubKey)
  }, [validators, targetValidator])

  const availableSelectedValidators = useMemo<ValidatorInfo[]>(() => {
    return selectedSources.filter(({ pubKey }) => pubKey !== targetValidator?.pubKey)
  }, [selectedSources, targetValidator])

  const isAll = useMemo(() => {
    return isSelectAll && selectedSources.length === availableSourceValidators.length
  }, [isSelectAll, selectedSources, availableSourceValidators])

  const toggleSource = (source: ValidatorInfo) => {
    const { pubKey } = source
    setSelectedSources((prev) => {
      const values = prev.filter((prevVal) => prevVal.pubKey === pubKey)
      if (values.length > 0) {
        return prev.filter((prevVal) => prevVal.pubKey !== pubKey)
      }

      return [...prev, source]
    })
  }

  const confirmSources = () => {
    onSelectTargetValidators(selectedSources)
    onNext()
  }

  const toggleIsSelectAll = () => {
    setSelectedSources(isAll ? [] : availableSourceValidators)
    setIsSelectAll(!isAll)
  }

  const removeSource = useCallback(
    (pubKey: string) => setSelectedSources((prev) => prev.filter((item) => item.pubKey !== pubKey)),
    [],
  )

  const stepBack = () => {
    setSelectedSources([])
    onBack()
  }

  const toggleSelfConsolidation = () => {
    setIsSelfConsolidate((prev) => !prev)
    if (targetValidator) {
      setSelectedSources(isSelfConsolidate ? [] : [targetValidator])
    }
  }

  const eligibleValidatorListClasses = addClassString('flex flex-col border-style', [
    isSelfConsolidate && 'opacity-20 pointer-events-none',
  ])

  return (
    <div className='w-full lg:h-full space-y-8 lg:space-y-0 flex flex-col lg:flex-row pt-4'>
      <div className='flex-1 @1600:max-w-2xl order-2 lg:order-1 pt-8 lg:pt-0 flex flex-col space-y-8'>
        <div className='space-y-2'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectSources.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectSources.text')}
          </Typography>
        </div>
        {canSelfConsolidate && (
          <div className='border-style bg-primary100 p-4 flex space-x-4'>
            <CheckBox
              id='self-consolidate'
              checked={isSelfConsolidate}
              checkboxBorderClasses='border border-gray-900 border-style500 dark:border-gray-400'
              onChange={toggleSelfConsolidation}
            />
            <div>
              <Typography isBold type='text-caption1'>
                {t('validatorManagement.consolidateView.selfConsolidate')}
              </Typography>
              <Typography type='text-caption1'>
                {t('validatorManagement.consolidateView.selfConsolidateHelperText')}
              </Typography>
            </div>
          </div>
        )}
        <div className={eligibleValidatorListClasses}>
          <div className='px-4 py-3 border-b-style flex justify-between'>
            <div className='flex items-center space-x-2'>
              <i className='bi bi-list-ul text-black dark:text-dark500 text-xl' />
              <Typography type='text-caption'>{t('eligibleValidators')}</Typography>
            </div>
            <CheckBox
              label={t('selectAll')}
              labelStyle='text-caption1 font-light'
              id='check_all'
              checked={isAll}
              onChange={toggleIsSelectAll}
            />
          </div>
          <div
            className={`h-full overflow-scroll ${canSelfConsolidate ? 'max-h-[248px]' : 'max-h-[348px]'}`}
          >
            {availableSourceValidators.map((source) => (
              <SelectSourceRow
                key={source.pubKey}
                source={source}
                isSelected={
                  selectedSources.filter(({ pubKey }) => source.pubKey === pubKey).length > 0
                }
                onSelect={toggleSource}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='w-16 @1440:w-32 @1540:w-48 h-full hidden lg:flex order-2 flex-col items-center justify-center'>
        <div className='w-10 flex items-center justify-center rounded h-10 bg-primary_10'>
          <i className='bi-arrow-right font-bold text-primary' />
        </div>
      </div>
      <div className='flex-1 order-1 lg:order-3 lg:max-w-xl space-y-6'>
        <div className='space-y-2 max-w-lg'>
          <Typography type='text-subtitle2'>{t('primaryValidator')}</Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectSources.selectedExplained')}
          </Typography>
        </div>
        {targetValidator ? (
          <SelectionDisplay
            selectedSources={availableSelectedValidators}
            onRemoveSource={removeSource}
            targetValidator={targetValidator}
          />
        ) : null}
        <div className='hidden lg:block'>
          <StepOptions
            onBackStep={stepBack}
            onNextStep={confirmSources}
            isDisabledNext={selectedSources.length < 1}
          />
        </div>
      </div>
      <div className='order-last lg:hidden'>
        <StepOptions
          onBackStep={stepBack}
          onNextStep={confirmSources}
          isDisabledNext={selectedSources.length < 1}
        />
      </div>
    </div>
  )
}

export default SelectSourceStep
