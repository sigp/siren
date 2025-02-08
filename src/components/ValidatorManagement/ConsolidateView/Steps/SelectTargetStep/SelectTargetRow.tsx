import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { ValidatorInfo } from '../../../../../types/validator'
import Typography from '../../../../Typography/Typography'

export interface SelectTargetRowProps {
  validator: ValidatorInfo
  onSelect: (validator: ValidatorInfo) => void
  isActive: boolean
}

const SelectTargetRow: FC<SelectTargetRowProps> = ({ validator, onSelect, isActive }) => {
  const { t } = useTranslation()
  const { pubKey, balance, name } = validator
  const rowClasses = addClassString('flex cursor-pointer items-center justify-between p-4', [
    isActive ? 'bg-primary100' : 'hover:bg-dark750',
  ])
  const iconClasses = addClassString('h-6 w-6 rounded-full from-primary to-tertiary', [
    isActive ? 'bg-gradient-to-l' : 'bg-gradient-to-r',
  ])

  const balanceFormatted = Math.round(balance)

  const selectTarget = () => onSelect(validator)
  return (
    <div onClick={selectTarget} className={rowClasses}>
      <div className='flex items-center space-x-2'>
        <div className='flex space-x-2 items-center border-r-style pr-2'>
          <div className={iconClasses} />
          <Typography type='text-caption'>{name}</Typography>
        </div>
        <Typography type='text-caption'>{formatEthAddress(pubKey)}</Typography>
      </div>
      <div className='flex space-x-2 items-center'>
        {isActive && (
          <div className='p-1 rounded bg-primary'>
            <Typography type='text-tiny'>{t('primaryValidator')}</Typography>
          </div>
        )}
        <Typography type='text-caption'>{balanceFormatted} ETH</Typography>
      </div>
    </div>
  )
}

export default SelectTargetRow
