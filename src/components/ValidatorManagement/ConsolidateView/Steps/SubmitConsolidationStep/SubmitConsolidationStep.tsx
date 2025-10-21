import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStorageAt } from 'wagmi'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import MiningSvg from '../../../../../assets/images/smart-contract-full.svg'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import { CONSOLIDATION_CONTRACT } from '../../../../../constants/constants'
import { Status } from '../../../../../constants/enums'
import { useMaxHeight } from '../../../../../hooks/useMaxHeight'
import { ConsolidationTx } from '../../../../../types'
import { ValidatorInfo } from '../../../../../types/validator'
import Button, { ButtonFace } from '../../../../Button/Button'
import CheckBox from '../../../../CheckBox/CheckBox'
import ConsolidationRequestStatus from '../../../../ConsolidationRequestStatus/ConsolidationRequestStatus'
import RangeSliderInput from '../../../../RangeSliderInput/RangeSliderInput'
import Tooltip from '../../../../ToolTip/Tooltip'
import Typography from '../../../../Typography/Typography'
import ConsolidationQueueStatus from './ConsolidationQueueStatus'
import ConsolidationRequest from './ConsolidationRequest'

export interface SubmitConsolidationStepProps {
  targetValidator: ValidatorInfo | undefined
  sourceValidators: ValidatorInfo[]
  chainId: number
  isActive: boolean
}

const SubmitConsolidationStep: FC<SubmitConsolidationStepProps> = ({
  targetValidator,
  sourceValidators,
  chainId,
  isActive,
}) => {
  const { t } = useTranslation()
  const [isExtraFee, setIsExtraFee] = useState(false)
  const [feeBuffer, setBuffer] = useState<number | undefined>(undefined)
  const [consolidationRequests, setRequests] = useState<ConsolidationTx[]>([])
  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()
  const transactionScrollRef = useRef<HTMLDivElement>(null)

  const setConsolidations = useCallback((request: ConsolidationTx) => {
    setRequests((prev) => [...prev, request])
  }, [])

  const updateConsolidationResults = useCallback((id: string | number, status: Status) => {
    setRequests((prev) => {
      const index = prev.findIndex((request) => request.index === id)
      if (index === -1) return prev
      const updatedRequests = [...prev]
      updatedRequests[index] = { ...updatedRequests[index], status }
      return updatedRequests
    })
  }, [])

  const retryTransaction = useCallback((txIndex: number | string) => {
    setRequests((prev) => prev.filter(({ index }) => index !== txIndex))
  }, [])

  const toggleIsExtraFee = () => {
    setIsExtraFee((prev) => !prev)

    if (isExtraFee) {
      setBuffer(undefined)
    } else {
      setBuffer(0)
    }
  }

  const changeBuffer = (e: ChangeEvent<HTMLInputElement>) => setBuffer(Number(e.target.value))

  const { data: consolidationQueLength, refetch } = useStorageAt({
    address: CONSOLIDATION_CONTRACT,
    slot: '0x00',
    chainId,
  })

  const queueLength: bigint = BigInt(consolidationQueLength ?? '0')

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  // Auto-scroll to show new transactions at the bottom
  useEffect(() => {
    if (transactionScrollRef.current && consolidationRequests.length > 0) {
      transactionScrollRef.current.scrollTo({
        top: transactionScrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [consolidationRequests.length])

  const renderedRequests = useMemo(
    () =>
      !!targetValidator
        ? sourceValidators.map((validator) => {
            const { pubKey: valPubKey, index } = validator
            const { pubKey: targetPubKey } = targetValidator
            const data = consolidationRequests.find((request) => request.index === index)
            const buffer = feeBuffer ? BigInt(feeBuffer) : 0n
            return (
              <ConsolidationRequest
                key={valPubKey}
                requestData={data}
                onSubmitRequest={setConsolidations}
                feeBuffer={buffer}
                chainId={chainId}
                targetPubKey={targetPubKey}
                validator={validator}
              />
            )
          })
        : null,
    [targetValidator, chainId, sourceValidators, consolidationRequests, feeBuffer],
  )

  const renderedTxStatuses = useMemo(() => {
    return consolidationRequests.map(({ txHash, index, pubKey, targetPubKey }) => (
      <ConsolidationRequestStatus
        key={txHash}
        targetPubKey={targetPubKey}
        sourcePubKey={pubKey}
        onRetryTx={retryTransaction}
        onStatusUpdate={updateConsolidationResults}
        id={index}
        networkId={chainId}
        txHash={txHash}
      />
    ))
  }, [consolidationRequests, retryTransaction, updateConsolidationResults, chainId])

  return (
    <div className='w-full h-full flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 py-4'>
      <div className='lg:hidden'>
        <Typography type='text-subtitle2'>
          {t('validatorManagement.consolidateView.signAndSubmit.title')}
        </Typography>
        <ConsolidationQueueStatus isActive={isActive} className='mt-4' queueLength={queueLength} />
      </div>
      <div
        ref={parentRef}
        className='flex-1 order-2 lg:order-1 lg:max-w-2xl mr-0 lg:mr-8 xl:mr-0 flex flex-col'
      >
        <div className='hidden lg:block'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.signAndSubmit.title')}
          </Typography>
          <ConsolidationQueueStatus
            isActive={isActive}
            className='mt-4'
            queueLength={queueLength}
          />
        </div>
        <div
          ref={targetChildRef}
          style={{ maxHeight: maxHeight }}
          className='w-full mt-4 flex flex-col'
        >
          {targetValidator ? (
            <>
              <div className='w-full border-style'>
                <div className='w-full p-2 border-b-style'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4'>
                      <ValidatorLogo className='text-black dark:text-dark500' />
                    </div>
                    <Typography>{t('primaryValidator')}</Typography>
                  </div>
                </div>
                <div className='w-full flex flex-col md:flex-row space-x-4 space-y-2 lg:space-y-0 p-2 md:items-center'>
                  <div className='h-8 w-8 hidden md:block rounded-full bg-gradient-to-r from-primary to-tertiary' />
                  <div className='flex space-x-2 pr-4 items-center border-r-style'>
                    <Typography type='text-caption1'>{targetValidator.name}</Typography>
                    <Typography type='text-caption1'>{targetValidator.index}</Typography>
                  </div>
                  <Tooltip
                    place='top-start'
                    style={{ fontSize: '11px' }}
                    id={`tool-target-${targetValidator.pubKey}`}
                    text={targetValidator.pubKey}
                  >
                    <Typography type='text-caption1'>
                      {formatEthAddress(targetValidator.pubKey, 12, 12)}
                    </Typography>
                  </Tooltip>
                </div>
              </div>
              <div className='w-full flex flex-col md:flex-row space-y-4 lg:space-y-0 justify-between p-2 border-style border-b-0 mt-4'>
                <div className='flex items-center space-x-2'>
                  <i className='bi bi-list-ul text-black dark:text-dark500 text-xl' />
                  <Typography>{t('consolidatingValidators')}</Typography>
                </div>
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
                    <div className='flex space-x-2 justify-center items-center'>
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
              <div className='h-full overflow-auto border-style'>{renderedRequests}</div>
            </>
          ) : null}
        </div>
      </div>
      <div className='flex-1 order-1 lg:order-2 lg:max-w-sm xl:max-w-xl flex space-y-4 flex-col lg:px-4'>
        <div className='flex space-x-4'>
          <Typography>
            {t('validatorManagement.consolidateView.signAndSubmit.transactionStatus')}
          </Typography>
          <div className='flex space-x-1 items-center'>
            <Typography color='text-dark400' darkMode='dark:text-dark600'>
              {String(consolidationRequests.length).padStart(2, '0')}
            </Typography>
            <Typography color='text-dark400' darkMode='dark:text-dark600'>
              /
            </Typography>
            <Typography color='text-dark400' darkMode='dark:text-dark600'>
              {String(sourceValidators.length).padStart(2, '0')}
            </Typography>
          </div>
        </div>
        {consolidationRequests.length ? (
          <div>
            <div
              ref={transactionScrollRef}
              className='w-full lg:max-h-[425px] overflow-scroll space-y-2'
            >
              {renderedTxStatuses}
            </div>
            <Button
              className='mt-8 w-full'
              type={ButtonFace.SECONDARY}
              href='/dashboard/validators'
            >
              {t('validatorManagement.manageValidators')}
            </Button>
          </div>
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
