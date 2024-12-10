import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ValidatorInfo } from '../../types/validator'
import Button, { ButtonFace } from '../Button/Button'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'
import Typography from '../Typography/Typography'
import ValidatorSearchInput from '../ValidatorSearchInput/ValidatorSearchInput'
import ValidatorTable from '../ValidatorTable/ValidatorTable'

export interface MainViewProps {
  scrollPercentage?: number | undefined
  validators: ValidatorInfo[]
  onChangeView: () => void
  onSetSearch: (value: string) => void
  search: string
}

const MainView: FC<MainViewProps> = ({
  scrollPercentage,
  validators,
  onChangeView,
  onSetSearch,
  search,
}) => {
  const { t } = useTranslation()

  return (
    <div className='w-full space-y-6'>
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
          <ValidatorSearchInput onChange={onSetSearch} value={search} />
          <div className='flex justify-center lg:justify-start space-x-4'>
            <DisabledTooltip>
              <Button type={ButtonFace.SECONDARY}>
                {t('validatorManagement.actions.deposit')}{' '}
                <i className='bi-arrow-down-circle ml-3' />
              </Button>
            </DisabledTooltip>
            <Button onClick={onChangeView} type={ButtonFace.SECONDARY}>
              {t('validatorManagement.actions.add')} <i className='bi-plus-circle-fill ml-3' />
            </Button>
          </div>
        </div>
      </div>
      <ValidatorTable
        scrollPercentage={scrollPercentage}
        isPaginated
        validators={validators}
        view='full'
      />
    </div>
  )
}

export default MainView
