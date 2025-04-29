import { formatEther, parseUnits } from 'ethers'
import React, { FC } from 'react'
import formatEthAddress from '../../../../../utilities/formatEthAddress'
import formatMoment from '../../../../../utilities/formatMoment'
import { PendingDeposit } from '../../../../types/validator'
import Typography from '../../../Typography/Typography'
import 'moment-duration-format'

export interface ValidatorPendingDepositRowProps {
  deposit: PendingDeposit
  headSlot: number
}

const ValidatorPendingDepositRow: FC<ValidatorPendingDepositRowProps> = ({ deposit, headSlot }) => {
  const { pubkey, amount, slot } = deposit
  const differenceInSlots = headSlot - slot
  const slotsInSeconds = differenceInSlots * 12
  const formattedTime = formatMoment(slotsInSeconds, true)
  const isZeroSlot = Number(slot) === 0

  return (
    <tr className='border-t-style'>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1'
        >
          {formatEthAddress(pubkey)}
        </Typography>
      </td>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1'
        >
          {Number(formatEther(parseUnits(amount, 'gwei')))} ETH
        </Typography>
      </td>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1'
        >
          {isZeroSlot ? '-' : slot}
        </Typography>
      </td>
      <td className='p-4'>
        <Typography
          className='text-center'
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1.5'
        >
          {isZeroSlot ? ' ' : `${formattedTime}...`}
        </Typography>
      </td>
    </tr>
  )
}

export default ValidatorPendingDepositRow
