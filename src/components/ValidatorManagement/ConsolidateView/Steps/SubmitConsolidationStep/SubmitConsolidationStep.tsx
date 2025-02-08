import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStorageAt } from 'wagmi'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import MiningSvg from '../../../../../assets/images/smart-contract-full.svg'
import { CONSOLIDATION_CONTRACT } from '../../../../../constants/constants'
import { ConsolidationTx } from '../../../../../types'
import { ValidatorInfo } from '../../../../../types/validator'
import CheckBox from '../../../../CheckBox/CheckBox'
import FlexedOverflow from '../../../../FlexedOverflow/FlexedOverflow'
import RangeSliderInput from '../../../../RangeSliderInput/RangeSliderInput'
import ResolvedTransactionStatus from '../../../../ResolvedTransactionStatus/ResolvedTransactionStatus'
import Typography from '../../../../Typography/Typography'
import ConsolidationQueueStatus from './ConsolidationQueueStatus'
import ConsolidationRequest from './ConsolidationRequest'

export interface SubmitConsolidationStepProps {
  targetValidator: ValidatorInfo | undefined
  sourceValidators: ValidatorInfo[]
  chainId: number
}

const SubmitConsolidationStep: FC<SubmitConsolidationStepProps> = ({
  targetValidator,
  sourceValidators,
  chainId,
}) => {
  const { t } = useTranslation()
  const [isExtraFee, setIsExtraFee] = useState(false)
  const [feeBuffer, setBuffer] = useState<number | undefined>(undefined)
  const [consolidationRequests, setRequests] = useState<ConsolidationTx[]>([])

  const setConsolidations = (request: ConsolidationTx) => {
    setRequests((prev) => [...prev, request])
  }

  const updateConsolidationResults = (id: string | number, status) => {
    const index = consolidationRequests.findIndex((request) => request.index === id)
    if (index !== -1) {
      const updatedRequests = [...consolidationRequests]
      updatedRequests[index] = {
        ...updatedRequests[index],
        status,
      }
      setRequests(updatedRequests)
    }
  }

  const retryTransaction = (txIndex: number) => {
    setRequests((prev) => prev.filter(({ index }) => index !== txIndex))
  }

  const toggleIsExtraFee = () => {
    setIsExtraFee((prev) => !prev)

    if (isExtraFee) {
      setBuffer(undefined)
    } else {
      setBuffer(0)
    }
  }

  const changeBuffer = (e) => setBuffer(Number(e.target.value))

  const { data: consolidationQueLength, refetch } = useStorageAt({
    address: CONSOLIDATION_CONTRACT,
    slot: '0x00',
    chainId,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className='w-full h-full flex justify-between py-4'>
      <div className='flex-1 max-w-2xl flex flex-col'>
        <Typography type='text-subtitle2'>
          {t('validatorManagement.consolidateView.signAndSubmit.title')}
        </Typography>
        <ConsolidationQueueStatus className='mt-4' queueLength={consolidationQueLength} />
        <div className='w-full mt-4 flex flex-1 flex-col'>
          {targetValidator ? (
            <>
              <div className='w-full border-style'>
                <div className='w-full p-2 border-b-style'>
                  <Typography>{t('primaryValidator')}</Typography>
                </div>
                <div className='w-full flex space-x-4 p-2 items-center'>
                  <div className='h-8 w-8 rounded-full bg-gradient-to-r from-primary to-tertiary' />
                  <div className='flex space-x-2 pr-4 items-center border-r-style'>
                    <Typography type='text-caption1'>{targetValidator.name}</Typography>
                    <Typography type='text-caption1'>{targetValidator.index}</Typography>
                  </div>
                  <Typography type='text-caption1'>
                    {formatEthAddress(targetValidator.pubKey, 12, 12)}
                  </Typography>
                </div>
              </div>
              <div className='w-full flex justify-between p-2 border-style mt-4'>
                <Typography>{t('consolidatingValidators')}</Typography>
                <div className='flex space-x-2 items-center'>
                  <CheckBox id='extraFee' checked={isExtraFee} onChange={toggleIsExtraFee} />
                  <label htmlFor='extraFee' className='w-44'>
                    <Typography
                      className={isExtraFee ? 'text-left' : 'text-right'}
                      type='text-caption2'
                    >
                      {t('validatorManagement.consolidateView.signAndSubmit.addExtraFee')}
                    </Typography>
                  </label>
                  {isExtraFee && (
                    <div className='flex space-x-2 items-center'>
                      <RangeSliderInput
                        className='w-16'
                        value={feeBuffer}
                        onChange={changeBuffer}
                        min={0}
                        max={30}
                        step={10}
                        id='extraFeeSlider'
                      />
                      <Typography type='text-caption2'>{feeBuffer} %</Typography>
                    </div>
                  )}
                </div>
              </div>
              <FlexedOverflow>
                {!!targetValidator &&
                  sourceValidators.map((validator) => (
                    <ConsolidationRequest
                      key={validator.pubKey}
                      requestData={consolidationRequests.find(
                        (request) => request.index === validator.index,
                      )}
                      onSubmitRequest={setConsolidations}
                      feeBuffer={feeBuffer ? BigInt(feeBuffer) : 0n}
                      chainId={chainId}
                      targetPubKey={targetValidator.pubKey}
                      validator={validator}
                      consolidationQueLength={consolidationQueLength}
                    />
                  ))}
              </FlexedOverflow>
            </>
          ) : null}
        </div>
      </div>
      <div className='flex-1 max-w-xl flex space-y-4 flex-col px-4'>
        <Typography>
          {t('validatorManagement.consolidateView.signAndSubmit.transactionStatus')}
        </Typography>
        {consolidationRequests.length ? (
          <FlexedOverflow className='w-full space-y-2'>
            {consolidationRequests.map(({ txHash, index }) => (
              <ResolvedTransactionStatus
                key={txHash}
                onRetryTx={retryTransaction}
                onStatusUpdate={updateConsolidationResults}
                id={index}
                networkId={chainId}
                successText={t('validatorManagement.consolidateView.signAndSubmit.successTxText')}
                pendingText={t('validatorManagement.consolidateView.signAndSubmit.pendingTxText')}
                errorText={t('validatorManagement.consolidateView.signAndSubmit.errorTxText')}
                txHash={txHash}
                title={t('validatorManagement.consolidateView.signAndSubmit.consolidationRequest')}
              />
            ))}
          </FlexedOverflow>
        ) : (
          <div className='w-full h-full flex-1'>
            <div className='w-full h-full border-style flex items-center justify-center'>
              <MiningSvg className='ease-in duration-500 transition-colors w-[300px] h-[300px]' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmitConsolidationStep
