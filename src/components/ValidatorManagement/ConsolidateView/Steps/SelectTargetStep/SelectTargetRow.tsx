import clsx from 'clsx'
import { AnimationControls, motion } from 'framer-motion'
import { FC, memo, useCallback, useMemo } from 'react'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { useValidatorAliases } from '../../../../../hooks/useValidatorAliases'
import useValidatorName from '../../../../../hooks/useValidatorName'
import { ValidatorInfo } from '../../../../../types/validator'
import Tooltip from '../../../../ToolTip/Tooltip'
import Typography from '../../../../Typography/Typography'
import WithdrawalAddressPill from '../../../../WithdrawalAddress/WithdrawalAddressPill'

interface SelectTargetRowProps {
  validator: ValidatorInfo
  onSelect: (validator: ValidatorInfo) => void
  isActive: boolean
  animIndex: number
  animControls: AnimationControls
}

const SelectTargetRow: FC<SelectTargetRowProps> = memo(
  ({ validator, onSelect, isActive, animControls, animIndex }) => {
    const { pubKey, withdrawalAddress, effectiveBalance } = validator
    const { aliases } = useValidatorAliases()
    const validatorName = useValidatorName(validator, aliases || {})
    const handleSelect = useCallback(() => onSelect(validator), [validator, onSelect])
    const initialAnim = useMemo(() => ({ y: -20, opacity: 0 }), [])

    const rowClasses = clsx(
      'flex items-center justify-between p-4 cursor-pointer transition-colors',
      isActive ? 'bg-primary100' : 'hover:bg-dark25 dark:hover:bg-dark750',
    )

    const iconClasses = clsx(
      'h-6 w-6 rounded-full hidden md:block',
      'bg-gradient-to-r from-primary to-tertiary',
      isActive && 'bg-gradient-to-l',
    )

    const nameGroupClasses = clsx(
      'flex items-center space-x-2 pr-4',
      'border-r',
      isActive ? 'dark:border-dark300' : 'border-r-style',
    )
    const pubKeyGroupClasses = clsx(
      'pl-2 w-[120px] hidden md:block border-r',
      isActive ? 'dark:border-dark300' : 'border-r-style',
    )

    const toolTipStyle = useMemo(() => ({ fontSize: '11px' }), [])
    const formattedPubKey = formatEthAddress(pubKey)

    return (
      <motion.div
        initial={initialAnim}
        animate={animControls}
        custom={animIndex}
        onClick={handleSelect}
        className={rowClasses}
      >
        <div className='flex items-center space-x-2'>
          <div className={nameGroupClasses}>
            <div className={iconClasses} />
            <Typography type='text-caption'>{validatorName}</Typography>
          </div>
          <div className={pubKeyGroupClasses}>
            <Tooltip
              place='top-start'
              style={toolTipStyle}
              id={`tooltip-select-${pubKey}`}
              text={pubKey}
            >
              <Typography className='hidden @425:block' type='text-caption'>
                {formattedPubKey}
              </Typography>
            </Tooltip>
          </div>
          <div className='pl-2 hidden @425:block'>
            {withdrawalAddress ? (
              <WithdrawalAddressPill
                hasPadding
                textColor={isActive ? 'text-white' : 'text-dark900'}
                isActive={isActive}
                id={`${pubKey}-pill-text`}
                address={withdrawalAddress}
              />
            ) : (
              <Typography className='hidden @425:block' type='text-caption1.5'>
                --
              </Typography>
            )}
          </div>
        </div>
        <Typography
          color='text-primary'
          darkMode={isActive ? 'dark:text-dark300' : 'dark:text-primary'}
          type='text-caption'
        >
          {effectiveBalance} ETH
        </Typography>
      </motion.div>
    )
  },
)

SelectTargetRow.displayName = 'SelectTargetRow'

export default SelectTargetRow
