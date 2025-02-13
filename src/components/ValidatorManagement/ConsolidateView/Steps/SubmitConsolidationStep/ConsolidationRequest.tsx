import { dataSlice, getAddress } from 'ethers'
import React, { FC } from 'react'
import addClassString from '../../../../../../utilities/addClassString'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import { ConsolidationTx } from '../../../../../types'
import { ValidatorInfo } from '../../../../../types/validator'
import Consolidate from '../../../../ConsolidateValidator/Consolidate'
import Spinner from '../../../../Spinner/Spinner'
import Typography from '../../../../Typography/Typography'

export interface ConsolidationRequestProps {
  validator: ValidatorInfo
  chainId: number
  targetPubKey: string
  consolidationQueLength: bigint | undefined
  feeBuffer: bigint
  onSubmitRequest: (request: ConsolidationTx) => void
  requestData: ConsolidationTx | undefined
}

const ConsolidationRequest: FC<ConsolidationRequestProps> = ({
  validator,
  targetPubKey,
  chainId,
  consolidationQueLength,
  feeBuffer,
  onSubmitRequest,
  requestData,
}) => {
  const { name, index, withdrawalAddress } = validator
  const { status } = requestData || {}

  const statusIconClass = addClassString('', [
    status === 'success' ? 'bi-check-lg text-success' : 'bi-x text-error',
  ])

  const withdrawalCredentials = getAddress(dataSlice(withdrawalAddress as string, 12))

  return (
    <div className='flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:items-center w-full border-t-0 border-style px-2 py-4'>
      <div className='flex items-center md:space-x-4'>
        <div className='h-8 w-8 hidden @425:block rounded-full bg-gradient-to-r from-primary to-tertiary' />
        <div className='flex items-center mr-4 lg:mr-0 space-x-2 border-r-style pr-4'>
          <Typography type='text-caption1'>{name}</Typography>
          <Typography className='hidden @425:block' type='text-caption1'>
            {index}
          </Typography>
        </div>
        <Typography type='text-caption1'>{formatEthAddress(withdrawalCredentials)}</Typography>
      </div>
      <div>
        {requestData ? (
          status === 'pending' ? (
            <Spinner size='h-3 w-3' />
          ) : (
            <i className={statusIconClass} />
          )
        ) : (
          <Consolidate
            bufferPercentage={feeBuffer}
            sourceValidator={validator}
            queueLength={consolidationQueLength}
            onSubmitRequest={onSubmitRequest}
            chainId={chainId}
            targetPubKey={targetPubKey}
          />
        )}
      </div>
    </div>
  )
}

export default ConsolidationRequest
