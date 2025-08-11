import { AnimationControls, motion } from 'framer-motion'
import { FC, useMemo } from 'react'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { useValidatorAliases } from '../../../../../hooks/useValidatorAliases'
import useValidatorName from '../../../../../hooks/useValidatorName'
import { ValidatorInfo } from '../../../../../types/validator'
import CheckBox from '../../../../CheckBox/CheckBox'
import Tooltip from '../../../../ToolTip/Tooltip'
import Typography from '../../../../Typography/Typography'
import WithdrawalAddressPill from '../../../../WithdrawalAddress/WithdrawalAddressPill'

export interface SelectSourceRowProps {
  source: ValidatorInfo
  isSelected: boolean
  onSelect: (source: ValidatorInfo) => void
  animControls: AnimationControls
  animIndex: number
}

const SelectSourceRow: FC<SelectSourceRowProps> = ({
  source,
  isSelected,
  onSelect,
  animControls,
  animIndex,
}) => {
  const { pubKey, balance, withdrawalAddress } = source
  const { aliases } = useValidatorAliases()
  const validatorName = useValidatorName(source, aliases || {})
  const selectSource = () => onSelect(source)
  const formattedBalance = Math.round(balance)
  const formattedPubKey = formatEthAddress(pubKey)

  const tooltipStyles = useMemo(() => ({ fontSize: '11px' }), [])
  const initialAnim = useMemo(() => ({ y: -20, opacity: 0 }), [])

  return (
    <motion.div
      initial={initialAnim}
      animate={animControls}
      custom={animIndex}
      onClick={selectSource}
      className='w-full p-4 cursor-pointer dark:hover:bg-dark750 hover:bg-dark25 flex items-center justify-between'
    >
      <div className='flex items-center space-x-2'>
        <div className='flex items-center space-x-3 border-r-style pr-4'>
          <CheckBox id={pubKey} readOnly checked={isSelected} />
          <div className='h-6 w-6 hidden xl:block rounded-full bg-gradient-to-r from-primary to-tertiary' />
          <Typography type='text-caption'>{validatorName}</Typography>
        </div>
        <div className='border-r-style hidden md:block lg:hidden xl:block self-stretch flex items-center px-4'>
          <Tooltip
            place='top-start'
            style={tooltipStyles}
            id={`tool-source-${pubKey}`}
            text={pubKey}
          >
            <Typography type='text-caption'>{formattedPubKey}</Typography>
          </Tooltip>
        </div>
        {withdrawalAddress ? (
          <div className='pl-4 hidden md:block'>
            <WithdrawalAddressPill
              id={`${pubKey}-pill-text`}
              hasPadding
              address={withdrawalAddress}
            />
          </div>
        ) : null}
      </div>
      <div>
        <Typography color='text-primary' darkMode='dark:text-primary' type='text-caption'>
          {formattedBalance} ETH
        </Typography>
      </div>
    </motion.div>
  )
}

export default SelectSourceRow
