'use client'

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useRecoilState, useSetRecoilState } from 'recoil';
import BlsExecutionModal from '../../../src/components/BlsExecutionModal/BlsExecutionModal';
import Button, { ButtonFace } from '../../../src/components/Button/Button'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import DisabledTooltip from '../../../src/components/DisabledTooltip/DisabledTooltip'
import EditValidatorModal from '../../../src/components/EditValidatorModal/EditValidatorModal';
import Typography from '../../../src/components/Typography/Typography'
import ValidatorModal from '../../../src/components/ValidatorModal/ValidatorModal'
import ValidatorSearchInput from '../../../src/components/ValidatorSearchInput/ValidatorSearchInput'
import ValidatorSummary from '../../../src/components/ValidatorSummary/ValidatorSummary'
import ValidatorTable from '../../../src/components/ValidatorTable/ValidatorTable'
import { CoinbaseExchangeRateUrl } from '../../../src/constants/constants'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { activeValidatorId, exchangeRates, isEditValidator, isValidatorDetail } from '../../../src/recoil/atoms';
import {
  BeaconNodeSpecResults,
  SyncData, ValidatorMetricResult
} from '../../../src/types/beacon';
import { Diagnostics } from '../../../src/types/diagnostic'
import { ValidatorCache, ValidatorCountResult, ValidatorInfo } from '../../../src/types/validator'

export interface MainProps {
  initNodeHealth: Diagnostics
  initValStates: ValidatorInfo[]
  initValidatorCountData: ValidatorCountResult
  initSyncData: SyncData
  initValCaches: ValidatorCache
  initValMetrics: ValidatorMetricResult
  beaconSpec: BeaconNodeSpecResults
}

const Main: FC<MainProps> = (props) => {
  const { t } = useTranslation()
  const {
    initNodeHealth,
    initSyncData,
    beaconSpec,
    initValidatorCountData,
    initValStates,
    initValCaches,
    initValMetrics,
  } = props

  const [scrollPercentage, setPercentage] = useState(0)

  const container = useRef<HTMLDivElement | null>(null)
  const { scrollY } = useScroll({
    container
  })

  useMotionValueEvent(scrollY, "change", (latest) => {
    if(container?.current) {
      const totalHeight = container.current.scrollHeight - container.current.clientHeight;
      setPercentage(Math.round((latest / totalHeight) * 100))
    }
  })

  const router = useRouter()
  const { SECONDS_PER_SLOT, SLOTS_PER_EPOCH } = beaconSpec
  const setExchangeRate = useSetRecoilState(exchangeRates)
  const [search, setSearch] = useState('')
  const [activeValId, setValidatorId] = useRecoilState(activeValidatorId)
  const [isEditVal, setIsEditValidator] = useRecoilState(isEditValidator)
  const setValDetail = useSetRecoilState(isValidatorDetail)
  const [isValDetail] = useRecoilState(isValidatorDetail)
  const [isRendered, setRender] = useState(false)

  const { isValidatorError, isBeaconError } = useNetworkMonitor()

  const networkError = isValidatorError || isBeaconError

  const slotInterval = SECONDS_PER_SLOT * 1000
  const epochInterval = slotInterval * Number(SLOTS_PER_EPOCH)
  const searchParams = useSearchParams()
  const validatorId = searchParams.get('id')
  const modalView = searchParams.get('view')
  const { data: exchangeData } = useSWRPolling(CoinbaseExchangeRateUrl, {
    refreshInterval: 60 * 1000,
    networkError,
  })

  const { data: valNetworkData } = useSWRPolling<ValidatorCountResult>('/api/validator-network', {
    refreshInterval: 60 * 1000,
    fallbackData: initValidatorCountData,
    networkError,
  })
  const { data: validatorCache } = useSWRPolling<ValidatorCache>('/api/validator-cache', {
    refreshInterval: slotInterval / 2,
    fallbackData: initValCaches,
    networkError,
  })
  const { data: validatorStates } = useSWRPolling<ValidatorInfo[]>(`/api/validator-states`, {
    refreshInterval: slotInterval,
    fallbackData: initValStates,
    networkError,
  })
  const { data: nodeHealth } = useSWRPolling<Diagnostics>('/api/node-health', {
    refreshInterval: 6000,
    fallbackData: initNodeHealth,
    networkError,
  })
  const { data: syncData } = useSWRPolling<SyncData>('/api/node-sync', {
    refreshInterval: slotInterval,
    fallbackData: initSyncData,
    networkError,
  })
  const { data: validatorMetrics } = useSWRPolling<ValidatorMetricResult>('/api/validator-metrics', { refreshInterval: epochInterval / 2, fallbackData: initValMetrics, networkError })

  const filteredValidators = useMemo(() => {
    return validatorStates.filter((validator) => {
      const query = search.toLowerCase()

      return (
        validator.name.toLowerCase().includes(query) ||
        (query.length > 3 && validator.pubKey.toLowerCase().includes(query)) ||
        validator.index.toString().includes(query)
      )
    })
  }, [search, validatorStates])

  const rates = exchangeData?.data.rates

  const activeValidator = useMemo(() => {
    if (activeValId === undefined) return

    return validatorStates.find(({ index }) => Number(activeValId) === index)
  }, [activeValId, validatorStates])

  useEffect(() => {
    if(isRendered) return

    if(validatorId) {
      setValidatorId(Number(validatorId))
    }

    if(modalView === 'detail') {
      setValDetail(true)
    }

    if(modalView === 'edit') {
      setIsEditValidator(true)
    }

    setRender(true)
  }, [validatorId, isRendered, modalView])

  useEffect(() => {
    if (rates) {
      setExchangeRate({
        rates,
        currencies: Object.keys(rates),
      })
    }
  }, [rates, setExchangeRate])

  const closeEditValModal = () => {
    setIsEditValidator(false);
    setValidatorId(undefined)
    router.push('/dashboard/validators')
  }

  return (
    <>
      <DashboardWrapper
        scrollRef={container}
        syncData={syncData}
        beaconSpec={beaconSpec}
        isBeaconError={isBeaconError}
        isValidatorError={isValidatorError}
        nodeHealth={nodeHealth}
      >
        <div className='w-full grid grid-cols-1 lg:block pb-12 p-4 mb-28 lg:mb-28'>
          <div className='w-full space-y-6 mb-6'>
            <div className='w-full flex flex-col items-center lg:flex-row space-y-8 lg:space-y-0 justify-between'>
              <Typography fontWeight='font-light' type='text-subtitle1' className='capitalize'>
                {t('validatorManagement.title')}
              </Typography>
              <ValidatorSummary
                validatorMetricResult={validatorMetrics}
                validators={validatorStates}
                validatorNetworkData={valNetworkData}
                validatorCacheData={validatorCache}
              />
            </div>
            <div className='flex flex-col lg:flex-row justify-between lg:items-center'>
              <Typography
                type='text-subtitle2'
                color='text-transparent'
                darkMode='text-transparent'
                className='primary-gradient-text capitalize'
                fontWeight='font-light'
              >
                {t('validatorManagement.overview')}
              </Typography>
              <div className='flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4'>
                <ValidatorSearchInput onChange={setSearch} value={search} />
                <div className='flex justify-center lg:justify-start space-x-4'>
                  <DisabledTooltip>
                    <Button type={ButtonFace.SECONDARY}>
                      {t('validatorManagement.actions.deposit')}{' '}
                      <i className='bi-arrow-down-circle ml-3' />
                    </Button>
                  </DisabledTooltip>
                  <DisabledTooltip>
                    <Button type={ButtonFace.SECONDARY}>
                      {t('validatorManagement.actions.add')}{' '}
                      <i className='bi-plus-circle-fill ml-3' />
                    </Button>
                  </DisabledTooltip>
                </div>
              </div>
            </div>
          </div>
          <ValidatorTable
            scrollPercentage={scrollPercentage}
            isPaginated
            validators={filteredValidators}
            view='full'
          />
        </div>
      </DashboardWrapper>
      <BlsExecutionModal />
      {isValDetail && activeValidator && (
        <ValidatorModal
          validator={activeValidator}
          validatorCacheData={validatorCache}
        />
      )}
      {
        isEditVal && activeValidator && (
          <EditValidatorModal validator={activeValidator} validatorCacheData={validatorCache} onClose={closeEditValModal}/>
        )
      }
    </>
  )
}

export default Main
