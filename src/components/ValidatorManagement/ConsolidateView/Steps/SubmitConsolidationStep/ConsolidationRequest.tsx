import { dataSlice, getAddress } from 'ethers'
import React, { FC } from 'react'
import addClassString from '../../../../../../utilities/addClassString'
import { Status } from '../../../../../constants/enums'
import { ConsolidationTx } from '../../../../../types'
import { ValidatorInfo } from '../../../../../types/validator'
import Consolidate from '../../../../ConsolidateValidator/Consolidate'
import Spinner from '../../../../Spinner/Spinner'
import Typography from '../../../../Typography/Typography'
import WithdrawalAddressPill from '../../../../WithdrawalAddress/WithdrawalAddressPill'

export interface ConsolidationRequestProps {
  validator: ValidatorInfo
  chainId: number
  targetPubKey: string
  feeBuffer: bigint
  onSubmitRequest: (request: ConsolidationTx) => void
  requestData: ConsolidationTx | undefined
}

const ConsolidationRequest: FC<ConsolidationRequestProps> = ({
  validator,
  targetPubKey,
  chainId,
  feeBuffer,
  onSubmitRequest,
  requestData,
}) => {
  const { name, index, withdrawalAddress } = validator
  const { status } = requestData || {}

  const statusIconClass = addClassString('', [
    status === Status.SUCCESS ? 'bi-check-lg text-success' : 'bi-x text-error',
  ])

  const withdrawalCredentials = getAddress(dataSlice(withdrawalAddress as string, 12))

  return (
    <div className='flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:items-center w-full last:border-b-0 border-b-style px-2 py-4'>
      <div className='flex items-center @425:space-x-4'>
        <div className='h-8 w-8 hidden @425:block rounded-full bg-gradient-to-r from-primary to-tertiary' />
        <div className='flex items-center mr-4 lg:mr-0 space-x-2 border-r-style pr-4'>
          <Typography type='text-caption1'>{name}</Typography>
          <Typography type='text-caption1'>{index}</Typography>
        </div>
        <WithdrawalAddressPill
          className='hidden @425:block'
          address={withdrawalCredentials}
          id={`tool-request-${index}`}
        />
      </div>
      <div>
        {requestData ? (
          status === Status.PENDING ? (
            <Spinner size='h-3 w-3' />
          ) : (
            <i className={statusIconClass} />
          )
        ) : (
          <Consolidate
            bufferPercentage={feeBuffer}
            sourceValidator={validator}
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
