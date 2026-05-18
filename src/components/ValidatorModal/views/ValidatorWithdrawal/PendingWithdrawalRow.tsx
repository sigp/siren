import { formatEther, parseUnits } from 'ethers'
import React, { FC } from 'react'
import formatMoment from '../../../../../utilities/formatMoment'
import { useNetworkProfile } from '../../../../hooks/useNetworkProfile'
import { PartialWithdrawal } from '../../../../types/validator'
import Typography from '../../../Typography/Typography'
import 'moment-duration-format'

export interface PendingWithdrawalRowProps {
  withdrawal: PartialWithdrawal
  currentEpoch: number
}

const PendingWithdrawalRow: FC<PendingWithdrawalRowProps> = ({ withdrawal, currentEpoch }) => {
  const { nativeSymbol } = useNetworkProfile()
  const { validator_index, amount, withdrawable_epoch } = withdrawal
  const formattedAmount = Number(formatEther(parseUnits(amount, 'gwei')))
  const timeInEpochs = Number(withdrawable_epoch) - currentEpoch
  const timeInSeconds = 32 * 12 * timeInEpochs
  const formattedTime = formatMoment(timeInSeconds)

  return (
    <tr className='border-t-style'>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1'
        >
          {validator_index}
        </Typography>
      </td>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1'
        >
          {formattedAmount} {nativeSymbol}
        </Typography>
      </td>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1'
        >
          {withdrawable_epoch}
        </Typography>
      </td>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1.5'
        >
          {formattedTime}...
        </Typography>
      </td>
    </tr>
  )
}

export default PendingWithdrawalRow
