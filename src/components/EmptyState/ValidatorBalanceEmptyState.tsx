import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'
import BarChart from '../../assets/images/bar-chart.png'
import Typography from '../Typography/Typography'

const ValidatorBalanceEmptyState = () => {
  const { t } = useTranslation()
  return (
    <div className='w-full bg-dark10 dark:bg-dark700 flex-1 bg-dark10 dark:bg-dark700 flex items-center justify-center'>
      <div className='flex flex-col items-center space-y-2'>
        <div className='h-[64px] w-[64px] flex items-center justify-center rounded-full dark:bg-dark600 opacity-60'>
          <Image alt='bar-chart' src={BarChart} width={64} height={64} />
        </div>
        <div className='max-w-[250px]'>
          <Typography type='text-caption1.5' className='text-center'>
            {t('emptyState.validatorBalanceChart.keepProgress')}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default ValidatorBalanceEmptyState
