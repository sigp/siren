import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { PartialWithdrawal } from '../../../../types/validator'
import Typography from '../../../Typography/Typography'
import PendingWithdrawalRow, { PendingWithdrawalRowProps } from './PendingWithdrawalRow'

export interface PendingWithdrawalsProps extends Pick<PendingWithdrawalRowProps, 'currentEpoch'> {
  withdrawals: PartialWithdrawal[]
}

const PendingWithdrawalsTable: FC<PendingWithdrawalsProps> = ({ withdrawals, currentEpoch }) => {
  const { t } = useTranslation()
  return (
    <div className='w-full bg-dark25 dark:bg-dark900'>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr>
            <th className='w-1/4 px-4 py-2 text-left'>
              <Typography
                isCapitalize
                color='text-dark400'
                darkMode='dark:text-dark500'
                type='text-caption1.5'
              >
                {t('index')}
              </Typography>
            </th>
            <th className='w-1/4 px-4 py-2 text-left'>
              <Typography
                isCapitalize
                color='text-dark400'
                darkMode='dark:text-dark500'
                type='text-caption1.5'
              >
                {t('amount')}
              </Typography>
            </th>
            <th className='w-1/4 px-4 py-2 text-left'>
              <Typography
                color='text-dark400'
                isCapitalize
                darkMode='dark:text-dark500'
                className='text-center'
                type='text-caption1.5'
              >
                {t('withdrawableEpoch')}
              </Typography>
            </th>
            <th className='w-1/4 px-4 py-2 text-left'></th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal, index) => (
            <PendingWithdrawalRow currentEpoch={currentEpoch} key={index} withdrawal={withdrawal} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PendingWithdrawalsTable
