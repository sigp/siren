import clsx from 'clsx'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_EFFECTIVE_BALANCE } from '../../../../../constants/constants'
import useAnimatedListControls from '../../../../../hooks/useAnimatedListControls'
import { useMaxHeight } from '../../../../../hooks/useMaxHeight'
import { ValidatorInfo } from '../../../../../types/validator'
import CheckBox from '../../../../CheckBox/CheckBox'
import NoEligibleValidatorsFound from '../../../../EmptyState/NoEligibleValidatorsFound'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../../CreateValidatorView/StepOptions'
import SelectionDisplay from './SelectionDisplay'
import SelectSourceRow from './SelectSourceRow'

export interface SelectSourceStepProps {
  validators: ValidatorInfo[]
  targetValidator: ValidatorInfo
  onSelectTargetValidators: (validators: ValidatorInfo[]) => void
  onNext: () => void
  onBack: () => void
  isActive: boolean
}

const SelectSourceStep: FC<SelectSourceStepProps> = ({
  validators,
  targetValidator,
  onSelectTargetValidators,
  onNext,
  onBack,
  isActive,
}) => {
  const { t } = useTranslation()
  const { withdrawalAddress, pubKey: targetPubKey, effectiveBalance } = targetValidator
  const isSelfValidateRestriction = withdrawalAddress?.startsWith('0x01')
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [selectedSources, setSelectedSources] = useState<ValidatorInfo[]>(
    isSelfValidateRestriction ? [targetValidator] : [],
  )
  const { controls } = useAnimatedListControls(isActive)
  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()

  const availableSourceValidators = useMemo<ValidatorInfo[]>(() => {
    return validators.filter(({ pubKey }) => pubKey !== targetPubKey)
  }, [validators, targetPubKey])

  const availableSelectedValidators = useMemo<ValidatorInfo[]>(() => {
    return selectedSources.filter(({ pubKey }) => pubKey !== targetPubKey)
  }, [selectedSources, targetPubKey])

  const isAll = isSelectAll && selectedSources.length === availableSourceValidators.length

  const toggleSource = useCallback((source: ValidatorInfo) => {
    const { pubKey } = source
    setSelectedSources((prev) => {
      const values = prev.filter((prevVal) => prevVal.pubKey === pubKey)
      if (values.length > 0) {
        return prev.filter((prevVal) => prevVal.pubKey !== pubKey)
      }

      return [...prev, source]
    })
  }, [])

  const confirmSources = useCallback(() => {
    onSelectTargetValidators(selectedSources)
    onNext()
  }, [onSelectTargetValidators, selectedSources, onNext])

  const toggleIsSelectAll = useCallback(() => {
    setSelectedSources(isAll ? [] : availableSourceValidators)
    setIsSelectAll(!isAll)
  }, [isAll, availableSourceValidators])

  const removeSource = useCallback(
    (pubKey: string) => setSelectedSources((prev) => prev.filter((item) => item.pubKey !== pubKey)),
    [],
  )

  const stepBack = useCallback(() => {
    setSelectedSources([])
    onBack()
  }, [onBack])

  const eligibleValidatorListClasses = clsx(
    'flex flex-col',
    isSelfValidateRestriction && 'opacity-20 pointer-events-none',
  )

  const renderedSourceValidators = useMemo(
    () =>
      availableSourceValidators.length ? (
        availableSourceValidators.map((source, index) => (
          <SelectSourceRow
            animControls={controls}
            animIndex={index}
            key={source.pubKey}
            source={source}
            isSelected={selectedSources.filter(({ pubKey }) => source.pubKey === pubKey).length > 0}
            onSelect={toggleSource}
          />
        ))
      ) : (
        <NoEligibleValidatorsFound />
      ),
    [selectedSources, availableSourceValidators, toggleSource, controls],
  )

  const totalEffectiveBalance = useMemo(() => {
    return (
      effectiveBalance +
      availableSelectedValidators.reduce((acc, { effectiveBalance }) => acc + effectiveBalance, 0)
    )
  }, [availableSelectedValidators, effectiveBalance])

  const isEmptySelection = selectedSources.length < 1
  const isOverMaxEB = totalEffectiveBalance > MAX_EFFECTIVE_BALANCE

  return (
    <div className='w-full lg:h-full space-y-8 lg:space-y-0 flex flex-col lg:flex-row 2xl:justify-center pt-4'>
      <div
        ref={parentRef}
        className='flex-1 @1600:max-w-2xl order-2 lg:order-1 pt-8 lg:pt-0 flex flex-col space-y-8'
      >
        <div className='space-y-2'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectSources.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectSources.text')}
          </Typography>
        </div>
        {isSelfValidateRestriction && (
          <div className='border-style bg-primary100 p-4 flex space-x-4'>
            <CheckBox
              id='self-consolidate'
              checked
              checkboxBorderClasses='border border-gray-900 border-style500 dark:border-gray-400'
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
        <div
          ref={targetChildRef}
          style={{ maxHeight: maxHeight }}
          className={eligibleValidatorListClasses}
        >
          <div className='px-4 py-3 border-style border-b-0 flex justify-between'>
            <div className='flex items-center space-x-2'>
              <i className='bi bi-list-ul text-black dark:text-dark500 text-xl' />
              <Typography type='text-caption'>{t('eligibleValidators')}</Typography>
            </div>
            <CheckBox
              label={t('selectAll')}
              labelStyle='text-caption1 font-light'
              id='check_all'
              checked={isAll}
              disabled={!availableSourceValidators.length}
              onChange={toggleIsSelectAll}
            />
          </div>
          <div className='h-full border-style overflow-auto'>{renderedSourceValidators}</div>
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
        <SelectionDisplay
          selectedSources={availableSelectedValidators}
          onRemoveSource={removeSource}
          targetValidator={targetValidator}
          isOverMaxEb={isOverMaxEB}
        />
        <div className='hidden lg:block'>
          <StepOptions
            onBackStep={stepBack}
            onNextStep={confirmSources}
            isDisabledNext={isEmptySelection || isOverMaxEB}
          />
        </div>
      </div>
      <div className='order-last lg:hidden'>
        <StepOptions
          onBackStep={stepBack}
          onNextStep={confirmSources}
          isDisabledNext={isEmptySelection || isOverMaxEB}
        />
      </div>
    </div>
  )
}

export default SelectSourceStep
