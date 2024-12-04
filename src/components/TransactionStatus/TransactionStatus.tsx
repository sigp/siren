import Link from 'next/link'
import { FC, ReactNode } from 'react'
import addClassString from '../../../utilities/addClassString'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getEtherscanLink from '../../../utilities/getEtherscanLink'
import { NetworkId, TxHash, TxStatus } from '../../types'
import Typography from '../Typography/Typography'

export interface TransactionStatusProps {
  id?: string | number
  txHash: TxHash
  status: TxStatus
  title: string
  text?: string | undefined
  children?: ReactNode
  networkId: NetworkId
}

const TransactionStatus: FC<TransactionStatusProps> = ({
  title,
  id,
  text,
  children,
  txHash,
  status,
  networkId,
}) => {
  const getContainerClass = () => {
    switch (status) {
      case 'pending':
        return 'border-warning bg-warning100'
      case 'success':
        return 'border-success bg-success100'
      default:
        return 'border-error bg-error100'
    }
  }
  const getIconClass = () => {
    switch (status) {
      case 'pending':
        return 'text-warning bi-exclamation text-4xl'
      case 'success':
        return 'text-success bi-check-lg text-2xl'
      default:
        return 'text-error bi-x text-3xl'
    }
  }

  const iconContainerClass = addClassString(
    'h-12 w-12 rounded-full flex items-center justify-center border',
    [getContainerClass()],
  )
  const iconClass = addClassString('', [getIconClass()])
  const isValidNetwork = networkId === NetworkId.HOLESKY || networkId === NetworkId.MAINNET
  const etherScanLink = isValidNetwork ? getEtherscanLink(networkId, `/tx/${txHash}`) : ''

  return (
    <div className='w-full flex items-center'>
      <div className='flex-1 space-y-2'>
        <div className='w-full flex items-center space-x-4'>
          <Typography isBold isCapitalize>{`${id ? `${id} • ` : ''}${title}`}</Typography>
          {isValidNetwork ? (
            <Link href={etherScanLink} target='_blank'>
              <div className='flex space-x-2 items-center'>
                <Typography color='text-dark400' type='text-caption1' className='underline'>
                  {formatEthAddress(txHash as string)}
                </Typography>
                <i className='text-dark400 text-caption1 bi-box-arrow-up-right' />
              </div>
            </Link>
          ) : (
            <Typography color='text-dark400' type='text-caption1' className='underline'>
              {formatEthAddress(txHash as string)}
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
