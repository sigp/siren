import { FC } from 'react'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { ValidatorInfo } from '../../../../../types/validator'
import CheckBox from '../../../../CheckBox/CheckBox'
import Typography from '../../../../Typography/Typography'

export interface SelectSourceRowProps {
  source: ValidatorInfo
  isSelected: boolean
  onSelect: (source: ValidatorInfo) => void
}

const SelectSourceRow: FC<SelectSourceRowProps> = ({ source, isSelected, onSelect }) => {
  const { pubKey, balance, name } = source
  const selectSource = () => onSelect(source)
  const formattedBalance = Math.round(balance)
  const formattedPubKey = formatEthAddress(pubKey)

  return (
    <div
      onClick={selectSource}
      className='w-full p-4 cursor-pointer dark:hover:bg-dark750 hover:bg-dark25 flex items-center justify-between'
    >
      <div className='flex items-center space-x-2'>
        <div className='flex items-center space-x-3 border-r-style pr-3'>
          <CheckBox id={pubKey} readOnly checked={isSelected} />
          <div className='h-8 w-8 rounded-full bg-gradient-to-r from-primary to-tertiary' />
          <Typography type='text-caption'>{name}</Typography>
        </div>
        <Typography className='hidden @425:block' type='text-caption'>
          {formattedPubKey}
        </Typography>
      </div>
      <div>
        <Typography type='text-caption'>{formattedBalance} ETH</Typography>
      </div>
    </div>
  )
}

export default SelectSourceRow
