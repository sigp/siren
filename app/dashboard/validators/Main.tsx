'use client'

import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useSetRecoilState } from 'recoil'
import BlsExecutionModal from '../../../src/components/BlsExecutionModal/BlsExecutionModal'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import EditValidatorModal from '../../../src/components/EditValidatorModal/EditValidatorModal'
import Typography from '../../../src/components/Typography/Typography'
import AddValidatorView from '../../../src/components/ValidatorManagement/AddValidatorView/AddValidatorView'
import CreateValidatorView from '../../../src/components/ValidatorManagement/CreateValidatorView/CreateValidatorView'
import MainView from '../../../src/components/ValidatorManagement/MainView'
import ValidatorModal from '../../../src/components/ValidatorModal/ValidatorModal'
import ValidatorSummary from '../../../src/components/ValidatorSummary/ValidatorSummary'
import { CoinbaseExchangeRateUrl } from '../../../src/constants/constants'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import {
  activeValidatorId,
  exchangeRates,
  isEditValidator,
  isValidatorDetail,
} from '../../../src/recoil/atoms'
import { ActivityResponse, ValidatorManagementView } from '../../../src/types'
import { BeaconNodeSpecResults, SyncData, ValidatorMetricResult } from '../../../src/types/beacon'
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
  initActivityData: ActivityResponse
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
    initActivityData,
  } = props

  const [scrollPercentage, setPercentage] = useState(0)

  const container = useRef<HTMLDivElement | null>(null)
  const { scrollY } = useScroll({
    container,
  })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (container?.current) {
      const totalHeight = container.current.scrollHeight - container.current.clientHeight
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

  const [view, setView] = useState<ValidatorManagementView>(ValidatorManagementView.MAIN)

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
  const { data: validatorMetrics } = useSWRPolling<ValidatorMetricResult>(
    '/api/validator-metrics',
    { refreshInterval: epochInterval / 2, fallbackData: initValMetrics, networkError },
  )

  const filteredValidators = useMemo(() => {
    return validatorStates.filter((validator) => {
      const query = search.toLowerCase()

      return (
        (validator.name || '').toLowerCase().includes(query) ||
        validator.pubKey.toLowerCase().includes(query) ||
        validator?.index?.toString().includes(query)
      )
    })
  }, [search, validatorStates])

  const rates = exchangeData?.data.rates

  const activeValidator = useMemo(() => {
    if (activeValId === undefined) return

    return validatorStates.find(({ index }) => Number(activeValId) === index)
  }, [activeValId, validatorStates])

  useEffect(() => {
    if (isRendered) return

    if (validatorId) {
      setValidatorId(Number(validatorId))
    }

    if (modalView === 'detail') {
      setValDetail(true)
    }

    if (modalView === 'edit') {
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
    setIsEditValidator(false)
    setValidatorId(undefined)
    router.push('/dashboard/validators')
  }

  const changeView = (view: ValidatorManagementView) => setView(view)
  const viewAddValidator = () => changeView(ValidatorManagementView.ADD)
  const viewMain = () => changeView(ValidatorManagementView.MAIN)

  const goBack = () => {
    if (view === ValidatorManagementView.CREATE) {
      viewAddValidator()
    } else {
      viewMain()
    }
  }
  const getPageTitle = (view: string) => {
    switch (view) {
      case ValidatorManagementView.CREATE:
        return t('validatorManagement.titles.create')
      case ValidatorManagementView.ADD:
        return t('validatorManagement.titles.add')
      default:
        return t('validatorManagement.titles.main')
    }
  }
  const renderView = (view: ValidatorManagementView) => {
    switch (view) {
      case ValidatorManagementView.CREATE:
        return (
          <CreateValidatorView onChangeView={changeView} validatorNetworkData={valNetworkData} />
        )
      case ValidatorManagementView.ADD:
        return <AddValidatorView onChangeView={changeView} />
      default:
        return (
          <MainView
            validators={filteredValidators}
            search={search}
            onSetSearch={setSearch}
            onChangeView={viewAddValidator}
            scrollPercentage={scrollPercentage}
          />
        )
    }
  }

  return (
    <>
      <DashboardWrapper
        initActivityData={initActivityData}
        scrollRef={container}
        syncData={syncData}
        beaconSpec={beaconSpec}
        isBeaconError={isBeaconError}
        isValidatorError={isValidatorError}
        nodeHealth={nodeHealth}
      >
        <div className='w-full flex flex-col pb-12 p-4 max-w-[96vw]'>
          <div className='w-full mb-6 flex flex-col lg:items-center lg:flex-row space-y-8 lg:space-y-0 justify-between'>
            <div className='space-x-4 flex items-center'>
              {view !== ValidatorManagementView.MAIN && (
                <i
                  onClick={goBack}
                  className='cursor-pointer active:scale-80 bi bi-chevron-left text-dark900 dark:text-dark300'
                />
              )}
              <Typography
                fontWeight='font-light'
                type='text-subtitle2'
                className='capitalize lg:text-subtitle1'
              >
                {getPageTitle(view)}
              </Typography>
            </div>
            <ValidatorSummary
              validatorMetricResult={validatorMetrics}
              validators={validatorStates}
              validatorNetworkData={valNetworkData}
              validatorCacheData={validatorCache}
            />
          </div>
          {renderView(view)}
        </div>
      </DashboardWrapper>
      <BlsExecutionModal />
      {isValDetail && activeValidator && (
        <ValidatorModal validator={activeValidator} validatorCacheData={validatorCache} />
      )}
      {isEditVal && activeValidator && (
        <EditValidatorModal
          validator={activeValidator}
          validatorCacheData={validatorCache}
          onClose={closeEditValModal}
        />
      )}
    </>
  )
}

export default Main
