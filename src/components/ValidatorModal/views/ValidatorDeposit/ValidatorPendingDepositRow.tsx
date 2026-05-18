import { formatEther, parseUnits } from 'ethers'
import React, { FC } from 'react'
import formatEthAddress from '../../../../../utilities/formatEthAddress'
import formatMoment from '../../../../../utilities/formatMoment'
import { useNetworkProfile } from '../../../../hooks/useNetworkProfile'
import { PendingDeposit } from '../../../../types/validator'
import Typography from '../../../Typography/Typography'
import 'moment-duration-format'

export interface ValidatorPendingDepositRowProps {
  deposit: PendingDeposit
  headSlot: number
}

const ValidatorPendingDepositRow: FC<ValidatorPendingDepositRowProps> = ({ deposit, headSlot }) => {
  const { nativeSymbol } = useNetworkProfile()
  const { pubkey, amount, slot } = deposit
  const formattedSlot = Number(slot)
  const differenceInSlots = headSlot - formattedSlot
  const slotsInSeconds = differenceInSlots * 12
  const formattedTime = formatMoment(slotsInSeconds, true)
  const isZeroSlot = formattedSlot === 0

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
          {Number(formatEther(parseUnits(amount, 'gwei')))} {nativeSymbol}
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
