import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import useElectraStatus from '../../hooks/useElectraStatus'
import { ValidatorManagementView } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import Button, { ButtonFace } from '../Button/Button'
import ValidatorTableEmptyState from '../EmptyState/ValidatorTableEmptyState'
import Toggle from '../Toggle/Toggle'
import Typography from '../Typography/Typography'
import ValidatorSearchInput from '../ValidatorSearchInput/ValidatorSearchInput'
import ValidatorTable from '../ValidatorTable/ValidatorTable'

export interface MainViewProps {
  scrollPercentage?: number | undefined
  validators: ValidatorInfo[]
  onChangeView: (value: ValidatorManagementView) => void
  onSetSearch: (value: string) => void
  search: string
  hasSearchAction: boolean
  hasConsolidationAction: boolean
  isActiveOnlyMode?: boolean
  onToggleActiveOnly?: () => void
  totalValidatorCount?: number
}

const MainView: FC<MainViewProps> = ({
  scrollPercentage,
  validators,
  onChangeView,
  onSetSearch,
  search,
  hasSearchAction,
  hasConsolidationAction,
  isActiveOnlyMode = false,
  onToggleActiveOnly,
  totalValidatorCount = 0,
}) => {
  const { t } = useTranslation()

  const viewAddVal = () => onChangeView(ValidatorManagementView.ADD)
  const viewConsolidateVal = () => onChangeView(ValidatorManagementView.CONSOLIDATE)
  const viewCreateVal = () => onChangeView(ValidatorManagementView.CREATE)

  const { isEnabled } = useElectraStatus()

  return (
    <div className='w-full space-y-6 pb-6'>
      <div className='flex flex-col lg:flex-row justify-between lg:items-center'>
        <Typography
          type='text-subtitle2'
          color='text-transparent'
          darkMode='text-transparent'
          className='primary-gradient-text capitalize'
          fontWeight='font-light'
        >
          {t('validatorManagement.overview')}
        </Typography>
        <div className='flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4'>
          <ValidatorSearchInput
            isDisabled={!hasSearchAction}
            onChange={onSetSearch}
            value={search}
          />
          <div className='flex justify-center lg:justify-start space-x-4'>
            <Button
              isDisabled={!isEnabled || !hasConsolidationAction}
              onClick={viewConsolidateVal}
              type={ButtonFace.TERTIARY}
            >
              {t('validatorManagement.actions.consolidate')}{' '}
              <i className='bi-arrows-angle-contract ml-3' />
            </Button>
            <Button onClick={viewAddVal} type={ButtonFace.SECONDARY}>
              {t('validatorManagement.actions.add')} <i className='bi-plus-circle-fill ml-3' />
            </Button>
          </div>
        </div>
      </div>
      <div className='space-y-4'>
        {onToggleActiveOnly && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <span className='text-sm font-medium text-dark900 dark:text-dark300'>
                Show Active Only
              </span>
              <Toggle
                id='active-only-toggle-management'
                value={isActiveOnlyMode}
                onChange={onToggleActiveOnly}
              />
            </div>
            {validators.length > 0 && (
              <span className='text-sm text-dark500 dark:text-dark400'>
                {validators.length} of {totalValidatorCount} validator
                {totalValidatorCount !== 1 ? 's' : ''} shown
              </span>
            )}
          </div>
        )}
        {validators.length ? (
          <ValidatorTable
            scrollPercentage={scrollPercentage}
            isPaginated
            validators={validators}
            view='full'
          />
        ) : hasSearchAction ? (
          <ValidatorTableEmptyState
            title={t('filteredValidatorTable.nonFound')}
            text={t('filteredValidatorTable.adjustFilter')}
            className='min-h-60'
          />
        ) : (
          <ValidatorTableEmptyState
            onClick={viewCreateVal}
            title={t('emptyState.validatorTable.noConnections')}
            text={t('emptyState.validatorTable.importOrDeposit')}
            href='/dashboard/validators?view=create'
            btnFontType='text-caption'
            className='min-h-96'
            ctaText='Create New Validator'
          />
        )}
      </div>
    </div>
  )
}

export default MainView
