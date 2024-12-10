import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { formatLocalCurrency } from '../../../../utilities/formatLocalCurrency'
import formatValidatorEpochData from '../../../../utilities/formatValidatorEpochData'
import getAvgEffectivenessStatus from '../../../../utilities/getAvgEffectivenessStatus'
import isBlsAddress from '../../../../utilities/isBlsAddress'
import toFixedIfNecessary from '../../../../utilities/toFixedIfNecessary'
import { exchangeRates, processingBlsValidators } from '../../../recoil/atoms'
import { ValidatorMetricResult } from '../../../types/beacon'
import { ValidatorBalanceInfo, ValidatorCache, ValidatorInfo } from '../../../types/validator'
import BeaconChaLink from '../../BeaconChaLink/BeaconChaLink'
import ValidatorDisclosure from '../../Disclosures/ValidatorDisclosure'
import EffectivenessBreakdown from '../../EffectivenessBreakdown/EffectivenessBreakdown'
import Status from '../../Status/Status'
import StatusIcon from '../../StatusIcon/StatusIcon'
import Typography from '../../Typography/Typography'
import ValidatorDetailTable from '../../ValidatorDetailTable/ValidatorDetailTable'
import ValidatorGraffiti from '../../ValidatorGraffiti/ValidatorGraffiti'
import ValidatorIncomeSummary from '../../ValidatorIncomeSummary/ValidatorIncomeSummary'
import ValidatorInfoCard from '../../ValidatorInfoCard/ValidatorInfoCard'
import ValidatorStatusProgress from '../../ValidatorStatusProgress/ValidatorStatusProgress'
import ValidatorActions from '../ValidatorActions'

export interface ValidatorDetailsProps {
  validator: ValidatorInfo
  validatorMetrics: ValidatorMetricResult | undefined
  validatorCacheData: ValidatorCache
  isAnimate: boolean
}

const ValidatorDetails: FC<ValidatorDetailsProps> = ({
  validator,
  validatorMetrics,
  validatorCacheData,
  isAnimate,
}) => {
  const { t } = useTranslation()
  const processingValidators = useRecoilValue(processingBlsValidators)
  const { index, balance, status, withdrawalAddress } = validator || {}
  const data = useRecoilValue(exchangeRates)
  const { targetEffectiveness, hitEffectiveness, totalEffectiveness } = validatorMetrics || {}
  const validatorEpochData = useMemo<ValidatorBalanceInfo>(() => {
    return formatValidatorEpochData([validator], validatorCacheData)
  }, [validator, validatorCacheData])

  const isProcessing = Boolean(
    processingValidators && index && processingValidators.includes(index.toString()),
  )

  const isBls = withdrawalAddress ? isBlsAddress(withdrawalAddress) : false
  const isExited = validator?.status.includes('exit') || validator?.status.includes('withdrawal')
  const combinedStatus = getAvgEffectivenessStatus(totalEffectiveness)

  const usdBalance = (balance || 0) * (data?.rates['USD'] || 0)

  return validator ? (
    <>
      <div className='w-full relative'>
        <div className='w-full flex flex-col lg:flex-row'>
          <ValidatorInfoCard animate isReady={isAnimate} validator={validator} />
          <div className='flex-1 flex py-4 justify-center items-center'>
            <div className='w-11/12 space-y-2'>
              <div className='w-full flex flex-col border-style100 lg:flex-row lg:shadow'>
                <div className='flex lg:flex-col lg:border-r-style100 justify-between'>
                  <div className='space-y-2 p-3'>
                    <Typography isBold type='text-caption1'>
                      {t('validatorManagement.details.balance')}
                    </Typography>
                    <div className='flex w-full space-x-4 justify-between'>
                      <Typography type='text-caption1' color='text-dark300'>
                        USD
                      </Typography>
                      <Typography type='text-caption1' isBold>
                        ${formatLocalCurrency(usdBalance)}
                      </Typography>
                    </div>
                  </div>
                  <div className='group py-3 z-20 space-y-2 px-6 lg:px-3 cursor-help relative'>
                    <Typography type='text-caption2' isBold isUpperCase>
                      {t('validatorManagement.summary.avgEffectiveness')}
                    </Typography>
                    <div className='flex space-x-8'>
                      <Status status={combinedStatus} />
                      <Typography isBold type='text-caption1'>
                        {totalEffectiveness
                          ? `${toFixedIfNecessary(totalEffectiveness, 2)} %`
                          : '---'}
                      </Typography>
                    </div>
                    <EffectivenessBreakdown
                      className='group-hover:block @1540:w-80'
                      target={targetEffectiveness}
                      head={hitEffectiveness}
                      targetDescription={t('validatorManagement.effectiveness.targetDescription')}
                      headDescription={t('validatorManagement.effectiveness.headHitDescription')}
                    />
                  </div>
                </div>
                <div className='space-y-4 border-t-style100 flex-1 lg:border-t-0 lg:border-r-style100 flex flex-col justify-between'>
                  <ValidatorIncomeSummary
                    validatorData={validatorEpochData}
                    className='pt-4 px-2 space-y-2 w-42'
                  />
                  <div className='w-full flex border-t lg:border-none'>
                    <div className='space-y-3 flex-1 pt-4 lg:pt-0 border-r px-2 pb-2 opacity-20'>
                      <Typography isBold type='text-caption2'>
                        {t('validatorManagement.details.slotsBehind')}
                      </Typography>
                      <Typography className='text-right'>-</Typography>
                    </div>
                    <div className='space-y-3 flex-1 pt-4 lg:pt-0 px-2 pb-2 opacity-20'>
                      <Typography isBold type='text-caption2'>
                        Epochs
                      </Typography>
                      <div className='w-full flex justify-between'>
                        <Typography>Node</Typography>
                        <Typography>-</Typography>
                      </div>
                    </div>
                  </div>
                </div>
                {index !== undefined && <BeaconChaLink index={index} />}
              </div>
              <div className='w-full flex border-style100 shadow py-2 px-4'>
                <div className='space-y-2 mr-4'>
                  <Typography type='text-caption2' isUpperCase isBold>
                    {t('validatorManagement.details.status')}
                  </Typography>
                  <div className='flex space-x-2'>
                    <Typography type='text-caption2' isUpperCase color='text-dark300'>
                      {t(`validatorStatus.${status}`)}
                    </Typography>
                    {status && <StatusIcon status={status} />}
                  </div>
                </div>
                {status && <ValidatorStatusProgress status={status} />}
              </div>
            </div>
          </div>
        </div>
        <ValidatorGraffiti validator={validator} />
        <ValidatorDetailTable validator={validator} validatorCacheData={validatorCacheData} />
        <ValidatorActions
          isExitAction={!isExited}
          isProcessing={isProcessing}
          isConversionRequired={isBls}
        />
        <div className='p-3 border-t-style100'>
          <ValidatorDisclosure />
        </div>
      </div>
    </>
  ) : null
}

export default ValidatorDetails
