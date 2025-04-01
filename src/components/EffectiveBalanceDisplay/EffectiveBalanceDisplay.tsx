import clsx from 'clsx'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import { MAX_EFFECTIVE_BALANCE } from '../../constants/constants'
import { ValidatorInfo } from '../../types/validator'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'
import WithdrawalAddressPill from '../WithdrawalAddress/WithdrawalAddressPill'

export interface EffectiveBalanceDisplayProps {
  validator: ValidatorInfo
  supplementAmount?: number
  className?: string
}

const EffectiveBalanceDisplay: FC<EffectiveBalanceDisplayProps> = ({
  validator,
  supplementAmount = 0,
  className,
}) => {
  const { t } = useTranslation()
  const { pubKey, withdrawalAddress, name, effectiveBalance } = validator
  const tooltipStyle = useMemo(() => ({ fontSize: '11px' }), [])
  const remainderToolTipStyle = useMemo(() => ({ ...tooltipStyle, width: '250px' }), [tooltipStyle])
  const formattedPubKey = formatEthAddress(pubKey, 7, 7)

  const { effective, remainder } = useMemo(() => {
    const incrementThreshold = 1.25
    const conversionCost = 1.0
    const conversionOffset = incrementThreshold - conversionCost

    const additionalUnits =
      supplementAmount >= incrementThreshold ? Math.floor(supplementAmount - conversionOffset) : 0

    return {
      effective: effectiveBalance + additionalUnits,
      remainder: supplementAmount - additionalUnits,
    }
  }, [supplementAmount, effectiveBalance])

  const isOverMaxEB = effective > MAX_EFFECTIVE_BALANCE
  const containerClasses = clsx(className, 'flex justify-between items-center')

  return (
    <div className={containerClasses}>
      <div className='flex sm:space-x-4'>
        <div className='hidden sm:block h-16 w-16 rounded-full bg-gradient-to-r from-primary to-tertiary' />
        <div className='space-y-1'>
          <Typography>{name}</Typography>
          <Tooltip
            place='top-start'
            style={tooltipStyle}
            id={`tool-display-${pubKey}`}
            text={pubKey}
          >
            <Typography type='text-caption' color='text-dark400' darkMode='dark:text-dark500'>
              {formattedPubKey}
            </Typography>
          </Tooltip>
          {withdrawalAddress ? (
            <WithdrawalAddressPill id={`${pubKey}-pill-text`} address={withdrawalAddress} />
          ) : null}
        </div>
      </div>
      <div>
        <Typography
          className='break-keep text-right'
          isBold
          type='text-subtitle1'
          color={isOverMaxEB ? 'text-error' : 'text-primary'}
          darkMode={isOverMaxEB ? 'dark:text-error' : 'dark:text-primary'}
        >
          {`${effective} ETH`}
        </Typography>
        {isOverMaxEB ? (
          <Typography
            type='text-tiny'
            className='max-w-[150px] text-right'
            color='text-error'
            darkMode='dark:text-error'
          >
            {t('validatorManagement.consolidateView.overMaxEbErrorText')}
          </Typography>
        ) : (
          <Typography
            type='text-tiny'
            className='max-w-[150px] text-right'
            color='text-primary'
            darkMode='dark:text-primary'
          >
            {t('maxEffectiveBalance')}
          </Typography>
        )}
        {remainder > 0 ? (
          <Tooltip
            place='top-start'
            style={remainderToolTipStyle}
            className='w-36'
            id={`tool-display-remainder-${pubKey}`}
            text={t('effectiveBalanceDisplay.remainderBalanceHelperText')}
          >
            <div className='flex items-center justify-end text-right'>
              <i className='bi mr-2 bi-exclamation-triangle-fill text-warning text-tiny' />
              <Typography type='text-tiny' className='max-w-[150px] text-right'>
                {t('effectiveBalanceDisplay.remainderEth', {
                  amount: `${remainder.toString().length > 5 ? '~ ' : ''}${remainder.toString().slice(0, 5)}`,
                })}
              </Typography>
            </div>
          </Tooltip>
        ) : null}
      </div>
    </div>
  )
}

export default EffectiveBalanceDisplay
