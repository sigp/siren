import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValidatorInfo } from '../../../../../types/validator'
import CheckBox from '../../../../CheckBox/CheckBox'
import FlexedOverflow from '../../../../FlexedOverflow/FlexedOverflow'
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
  const [selectedSources, setSelectedSources] = useState<ValidatorInfo[]>([])

  const availableSourceValidators = useMemo<ValidatorInfo[]>(() => {
    return validators.filter(({ pubKey }) => pubKey !== targetValidator?.pubKey)
  }, [validators, targetValidator])

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

  const removeSource = (pubKey: string) =>
    setSelectedSources((prev) => prev.filter((item) => item.pubKey !== pubKey))

  const stepBack = () => {
    setSelectedSources([])
    onBack()
  }

  return (
    <div className='w-full h-full flex pt-4'>
      <div className='flex-1 flex flex-col space-y-8'>
        <div className='space-y-2'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectSources.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectSources.text')}
          </Typography>
        </div>
        <div className='flex-1 flex flex-col border-style'>
          <div className='px-4 py-3 border-b-style flex justify-between'>
            <Typography type='text-caption'>{t('eligibleValidators')}</Typography>
            <div className='flex space-x-2 items-center'>
              <CheckBox
                label={t('selectAll')}
                labelStyle='text-caption1 font-light'
                id='check_all'
                checked={isAll}
                onChange={toggleIsSelectAll}
              />
            </div>
          </div>
          <FlexedOverflow>
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
          </FlexedOverflow>
        </div>
      </div>
      <div className='w-48 h-full flex flex-col items-center justify-center'>
        <div className='w-10 flex items-center justify-center rounded h-10 bg-primary_10'>
          <i className='bi-arrow-right font-bold text-primary' />
        </div>
      </div>
      <div className='flex-1 max-w-2xl space-y-6'>
        <div className='space-y-2'>
          <Typography type='text-subtitle2'>{t('primaryValidator')}</Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectSources.selectedExplained')}
          </Typography>
        </div>
        {targetValidator ? (
          <SelectionDisplay
            selectedSources={selectedSources}
            onRemoveSource={removeSource}
            targetValidator={targetValidator}
          />
        ) : null}
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
