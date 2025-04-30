import clsx from 'clsx'
import Link from 'next/link'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getEtherscanLink from '../../../utilities/getEtherscanLink'
import isValidNetwork from '../../../utilities/isValidNetwork'
import Button, { ButtonFace } from '../Button/Button'
import Typography from '../Typography/Typography'

export interface TransactionStatusBlockProps {
  txHash: string
  txStatus: string | undefined
  onError?: () => void
  onErrorText?: string
  onSuccessText?: string
  onSuccess?: () => void
  chainId: number
}

const TransactionStatusBlock: FC<TransactionStatusBlockProps> = ({
  txHash,
  txStatus,
  onError,
  onErrorText,
  onSuccessText,
  onSuccess,
  chainId,
}) => {
  const { t } = useTranslation()
  const isSuccess = txStatus === 'success'
  const isError = txStatus === 'error'
  const etherScanLink = isValidNetwork(chainId) ? getEtherscanLink(chainId, `/tx/${txHash}`) : null

  const hasErrorCallback = !!onError && !!onErrorText
  const hasSuccessCallback = !!onSuccess && onSuccessText

  const statusTitle = `validatorManagement.txStatuses.${isSuccess ? 'success' : isError ? 'error' : 'pending'}.title`
  const statusText = `validatorManagement.txStatuses.${isSuccess ? 'success' : isError ? 'error' : 'pending'}.text`
  const txIcon = clsx(
    isSuccess
      ? 'bi-check text-subtitle1 text-success '
      : isError
        ? 'bi-exclamation-triangle text-body text-error'
        : 'bi-clock-history text-body text-warning',
  )
  const txIconBackground = clsx(
    'h-12 w-12 flex items-center justify-center rounded-full border',
    isSuccess
      ? 'border-success bg-success100 '
      : isError
        ? 'border-error bg-error100'
        : 'border-warning bg-warning100',
  )
  const txHashContainerClasses = clsx(
    'flex flex-col md:flex-row space-y-2 md:space-y-0 text-center md:space-x-4 border py-2 px-4 md:px-2',
    isSuccess ? 'border-success100' : isError ? 'border-error100' : 'border-style',
  )

  const txHashContent = (
    <div className={txHashContainerClasses}>
      <Typography type='text-caption'>{t(statusTitle)}</Typography>
      <Typography type='text-caption'>{formatEthAddress(txHash as string)}</Typography>
    </div>
  )

  return (
    <div className='w-full bg-dark750 p-8 flex flex-col items-center justify-center space-y-6'>
      <div className={txIconBackground}>
        <i className={txIcon} />
      </div>
      {etherScanLink ? (
        <Link href={etherScanLink} target='_blank'>
          {txHashContent}
        </Link>
      ) : (
        txHashContent
      )}
      <Typography className='text-center' type='text-caption'>
        {t(statusText)}
      </Typography>
      {isError && hasErrorCallback ? (
        <Button fontType='text-caption1' onClick={onError} type={ButtonFace.SECONDARY}>
          {onErrorText}
        </Button>
      ) : isSuccess && hasSuccessCallback ? (
        <Button fontType='text-caption1' onClick={onSuccess} type={ButtonFace.SECONDARY}>
          {onSuccessText}
        </Button>
      ) : null}
    </div>
  )
}

export default TransactionStatusBlock
