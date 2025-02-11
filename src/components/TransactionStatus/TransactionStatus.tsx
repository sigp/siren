import Link from 'next/link'
import { FC, ReactNode, useMemo } from 'react'
import addClassString from '../../../utilities/addClassString'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getEtherscanLink from '../../../utilities/getEtherscanLink'
import { NetworkId, TxHash, TxStatus } from '../../types'
import Typography from '../Typography/Typography'

export enum TransactionStatusStyle {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

export interface TransactionStatusProps {
  id?: string | number
  txHash: TxHash
  status: TxStatus
  title: string
  text?: string
  children?: ReactNode
  networkId: NetworkId
  style?: TransactionStatusStyle
}

const TransactionStatus: FC<TransactionStatusProps> = ({
  id,
  txHash,
  status,
  title,
  text,
  children,
  networkId,
  style = TransactionStatusStyle.Primary,
}) => {
  const containerClasses = addClassString('w-full flex items-center', [
    style === TransactionStatusStyle.Secondary && 'border-style rounded p-4',
  ])

  const statusContainerClass = useMemo(() => {
    if (status === 'pending') return 'border-warning bg-warning100'
    if (status === 'success') return 'border-success bg-success100'
    return 'border-error bg-error100'
  }, [status])

  const iconClass = useMemo(() => {
    if (status === 'pending') return 'text-warning bi-exclamation text-4xl'
    if (status === 'success') return 'text-success bi-check-lg text-2xl'
    return 'text-error bi-x text-3xl'
  }, [status])

  const iconContainerClass = addClassString(
    'h-12 w-12 rounded-full flex items-center justify-center border',
    [statusContainerClass],
  )
  const isValidNetwork = networkId === NetworkId.HOLESKY || networkId === NetworkId.MAINNET
  const etherscanLink = isValidNetwork ? getEtherscanLink(networkId, `/tx/${txHash}`) : ''

  const displayTitle = id ? `${id} • ${title}` : title
  const formattedTxHash = formatEthAddress(txHash as string)

  return (
    <div className={containerClasses}>
      <div className='flex-1 space-y-2'>
        <div className='w-full flex items-center space-x-4'>
          <Typography isBold isCapitalize>
            {displayTitle}
          </Typography>
          {isValidNetwork ? (
            <Link href={etherscanLink} target='_blank'>
              <div className='flex space-x-2 items-center'>
                <Typography color='text-dark400' type='text-caption1' className='underline'>
                  {formattedTxHash}
                </Typography>
                <i className='text-dark400 text-caption1 bi-box-arrow-up-right' />
              </div>
            </Link>
          ) : (
            <Typography color='text-dark400' type='text-caption1' className='underline'>
              {formattedTxHash}
            </Typography>
          )}
        </div>
        <div className='w-full max-w-[350px]'>
          {children ? children : text ? <Typography type='text-caption1'>{text}</Typography> : null}
        </div>
      </div>
      <div className={iconContainerClass}>
        <i className={iconClass} />
      </div>
    </div>
  )
}

export default TransactionStatus
