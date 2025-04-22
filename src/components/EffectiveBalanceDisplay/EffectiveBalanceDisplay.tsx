import clsx from 'clsx'
import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import { EFFECTIVE_BALANCE, MAX_EFFECTIVE_BALANCE } from '../../constants/constants'
import useProcessEffectiveBalance from '../../hooks/useProcessEffectiveBalance'
import { ValidatorInfo } from '../../types/validator'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'
import WithdrawalAddressPill from '../WithdrawalAddress/WithdrawalAddressPill'
import DisplayTextBox from './DisplayTextBox'

export interface EffectiveBalanceDisplayProps {
  validator: ValidatorInfo
  supplementAmount?: number
  className?: string
  isFullDisplay?: boolean
  maxEffectiveBalance?: number
}

const EffectiveBalanceDisplay: FC<EffectiveBalanceDisplayProps> = ({
  validator,
  supplementAmount = 0,
  className,
  isFullDisplay,
  maxEffectiveBalance,
}) => {
  const { t } = useTranslation()
  const { pubKey, withdrawalAddress, name, effectiveBalance, balance } = validator
  const tooltipStyle = useMemo(() => ({ fontSize: '11px' }), [])
  const formattedPubKey = formatEthAddress(pubKey, 7, 7)
  const newBalance = balance + supplementAmount

  const { effective } = useProcessEffectiveBalance(newBalance, effectiveBalance)

  const isOverMaxEB = effective > MAX_EFFECTIVE_BALANCE
  const isUnderMinEB = effective < EFFECTIVE_BALANCE
  const isUnderMinBalance = newBalance < EFFECTIVE_BALANCE
  const containerClasses = clsx(className, 'flex justify-between items-center')
  const textAlignment = isFullDisplay ? 'text-center' : 'text-right'
  const effectiveTextClasses = clsx('break-keep', textAlignment)
  const descriptiveTextClasses = clsx('max-w-[150px]', textAlignment)
  const isInvalidEffectiveBalance = isOverMaxEB || isUnderMinEB
  const effectiveBorderClasses = clsx(
    'border flex-1 p-4 text-center',
    isInvalidEffectiveBalance ? 'border-error' : 'border-style',
  )

  const effectiveBalanceDisplay = (
    <div>
      <Typography
        className={effectiveTextClasses}
        isBold
        type='text-subtitle1'
        color={isInvalidEffectiveBalance ? 'text-error' : 'text-primary'}
        darkMode={isInvalidEffectiveBalance ? 'dark:text-error' : 'dark:text-primary'}
      >
        {`${effective}${!isFullDisplay ? ' ETH' : ''}`}
      </Typography>
      {isOverMaxEB && !isFullDisplay ? (
        <Typography
          type='text-tiny'
          className={descriptiveTextClasses}
          color='text-error'
          darkMode='dark:text-error'
        >
          {t('validatorManagement.consolidateView.overMaxEbErrorText')}
        </Typography>
      ) : isUnderMinEB && !isFullDisplay ? (
        <Typography
          type='text-tiny'
          className={descriptiveTextClasses}
          color='text-error'
          darkMode='dark:text-error'
        >
          {t('validatorManagement.consolidateView.underMinEbErrorText')}
        </Typography>
      ) : (
        <Typography
          type='text-tiny'
          className={descriptiveTextClasses}
          color={isInvalidEffectiveBalance ? 'text-error' : 'text-primary'}
          darkMode={isInvalidEffectiveBalance ? 'dark:text-error' : 'dark:text-primary'}
        >
          {t('effectiveBalance')}
        </Typography>
      )}
    </div>
  )

  const validatorInfoDisplay = (
    <div className='flex sm:space-x-4'>
      <div className='hidden sm:block h-16 w-16 rounded-full bg-gradient-to-r from-primary to-tertiary' />
      <div className='space-y-1'>
        <Typography>{name}</Typography>
        <Tooltip place='top-start' style={tooltipStyle} id={`tool-display-${pubKey}`} text={pubKey}>
          <Typography type='text-caption' color='text-dark400' darkMode='dark:text-dark500'>
            {formattedPubKey}
          </Typography>
        </Tooltip>
        {withdrawalAddress ? (
          <WithdrawalAddressPill id={`${pubKey}-pill-text`} address={withdrawalAddress} />
        ) : null}
      </div>
    </div>
  )

  return isFullDisplay ? (
    <div className='flex flex-col space-y-4'>
      <div className='p-4 border-style'>{validatorInfoDisplay}</div>
      <div className='w-full flex space-x-4'>
        <DisplayTextBox
          isError={isUnderMinBalance}
          title={formatLocalCurrency(newBalance, { min: 0, max: 4 })}
          subTitle={t('balance')}
        />
        <div className={effectiveBorderClasses}>{effectiveBalanceDisplay}</div>
        <DisplayTextBox
          title={maxEffectiveBalance?.toString()}
          subTitle={t('maxEffectiveBalance')}
        />
      </div>
    </div>
  ) : (
    <div className={containerClasses}>
      {validatorInfoDisplay}
      {effectiveBalanceDisplay}
    </div>
  )
}

export default EffectiveBalanceDisplay
