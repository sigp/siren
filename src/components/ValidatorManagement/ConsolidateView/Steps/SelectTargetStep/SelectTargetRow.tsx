import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { ValidatorInfo } from '../../../../../types/validator'
import Tooltip from '../../../../ToolTip/Tooltip'
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
    isActive ? 'bg-primary100' : 'dark:hover:bg-dark750 hover:bg-dark25',
  ])
  const iconClasses = addClassString('h-6 w-6 rounded-full from-primary to-tertiary', [
    isActive ? 'bg-gradient-to-l' : 'bg-gradient-to-r',
  ])

  const nameGroupClasses = addClassString('flex space-x-2 items-center pr-2', [
    isActive ? 'border-r dark:border-r-dark300' : 'border-r-style',
  ])

  const balanceFormatted = Math.round(balance)

  const selectTarget = () => onSelect(validator)
  return (
    <div onClick={selectTarget} className={rowClasses}>
      <div className='flex items-center space-x-2'>
        <div className={nameGroupClasses}>
          <div className={iconClasses} />
          <Typography type='text-caption'>{name}</Typography>
        </div>
        <Tooltip
          place='top-start'
          style={{ fontSize: '11px' }}
          id={`tool-select-${pubKey}`}
          text={pubKey}
        >
          <Typography className='hidden @425:block' type='text-caption'>
            {formatEthAddress(pubKey)}
          </Typography>
        </Tooltip>
      </div>
      <div className='flex space-x-2 items-center'>
        {isActive && (
          <div className='p-1 hidden sm:block rounded bg-primary'>
            <Typography color='text-white' type='text-tiny'>
              {t('primaryValidator')}
            </Typography>
          </div>
        )}
        <Typography type='text-caption'>{balanceFormatted} ETH</Typography>
      </div>
    </div>
  )
}

export default SelectTargetRow
