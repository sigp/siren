'use client'

import { IBls } from '@chainsafe/bls/types'
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
import ConsolidateView from '../../../src/components/ValidatorManagement/ConsolidateView/ConsolidateView'
import CreateValidatorView from '../../../src/components/ValidatorManagement/CreateValidatorView/CreateValidatorView'
import MainView from '../../../src/components/ValidatorManagement/MainView'
import ValidatorModal from '../../../src/components/ValidatorModal/ValidatorModal'
import ValidatorSummary from '../../../src/components/ValidatorSummary/ValidatorSummary'
import { CoinbaseExchangeRateUrl } from '../../../src/constants/constants'
import { ValidatorModalView } from '../../../src/constants/enums'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import { useNodeHealth, useSyncData } from '../../../src/hooks/useSharedData'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import useValidatorExclusionList from '../../../src/hooks/useValidatorExclusionList'
import {
  activeValidatorId,
  blsModuleAtom,
  exchangeRates,
  forkVersion,
  isEditValidator,
  isValidatorDetail,
} from '../../../src/recoil/atoms'
import { ActivityResponse, ExcludedStatus, ValidatorManagementView } from '../../../src/types'
import {
  BeaconNodeSpecResults,
  ForkVersionData,
  SyncData,
  ValidatorMetricResult,
} from '../../../src/types/beacon'
import { Diagnostics } from '../../../src/types/diagnostic'
import {
  PartialWithdrawal,
  PendingDeposit,
  ValidatorCache,
  ValidatorCountResult,
  ValidatorInfo,
  ValidatorStatus,
} from '../../../src/types/validator'

export interface MainProps {
  initNodeHealth: Diagnostics
  initValStates: ValidatorInfo[]
  initValidatorCountData: ValidatorCountResult
  initSyncData: SyncData
  initValCaches: ValidatorCache
  initValMetrics: ValidatorMetricResult
  beaconSpec: BeaconNodeSpecResults
  initActivityData: ActivityResponse
  initForkVersionData: ForkVersionData
  initPartialWithdrawals: PartialWithdrawal[]
  initPendingDeposits: PendingDeposit[]
  initExclusionData: ExcludedStatus[]
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
    initForkVersionData,
    initPartialWithdrawals,
    initPendingDeposits,
    initExclusionData,
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
  const {
    SECONDS_PER_SLOT,
    SLOTS_PER_EPOCH,
    DEPOSIT_CHAIN_ID,
    MIN_VALIDATOR_WITHDRAWABILITY_DELAY,
    SHARD_COMMITTEE_PERIOD,
  } = beaconSpec

  const setExchangeRate = useSetRecoilState(exchangeRates)
  const [search, setSearch] = useState('')
  const [activeValId, setValidatorId] = useRecoilState(activeValidatorId)
  const [isEditVal, setIsEditValidator] = useRecoilState(isEditValidator)
  const setValDetail = useSetRecoilState(isValidatorDetail)
  const setForkVersion = useSetRecoilState(forkVersion)
  const setBlsModule = useSetRecoilState(blsModuleAtom)
  const [isValDetail] = useRecoilState(isValidatorDetail)
  const [isRendered, setRender] = useState(false)
  const [isActiveOnlyMode, setIsActiveOnlyMode] = useState(false)

  const { isValidatorError, isBeaconError } = useNetworkMonitor()

  const networkError = isValidatorError || isBeaconError

  const slotInterval = SECONDS_PER_SLOT * 1000
  const epochInterval = slotInterval * Number(SLOTS_PER_EPOCH)
  const searchParams = useSearchParams()
  const validatorIdSearchParam = searchParams.get('id')
  const modalSearchParam = searchParams.get('modal')
  const viewSearchParam = searchParams.get('view')
  const { data: exchangeData } = useSWRPolling(CoinbaseExchangeRateUrl, {
    refreshInterval: 60 * 1000,
    networkError,
  })

  const { formattedExclusions } = useValidatorExclusionList(initExclusionData)

  const activeStatuses: ValidatorStatus[] = [
    'active',
    'active_ongoing',
    'active_exiting',
    'active_slashed',
  ]
  const allPossibleStatuses: ValidatorStatus[] = [
    'pending_initialized',
    'pending_queued',
    'active_ongoing',
    'active_exiting',
    'active_slashed',
    'exited_unslashed',
    'exited_slashed',
    'withdrawal_possible',
    'withdrawal_done',
    'active',
    'pending',
    'exited',
    'withdrawal',
    'deposit',
  ]
  const nonActiveStatuses = allPossibleStatuses.filter((status) => !activeStatuses.includes(status))

  // Keep the old logic for determining if exclusions match active-only mode
  const exclusionsMatchActiveOnly = useMemo(() => {
    return (
      nonActiveStatuses.every((status) => formattedExclusions.includes(status)) &&
      activeStatuses.some((status) => !formattedExclusions.includes(status))
    )
  }, [formattedExclusions])

  const toggleActiveOnlyMode = () => {
    setIsActiveOnlyMode(!isActiveOnlyMode)
  }

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

  // Use shared hooks for common data - this enables instant navigation
  // by reading from SWR's global cache across all pages
  const { data: nodeHealth } = useNodeHealth(initNodeHealth, networkError)
  const { data: syncData } = useSyncData(slotInterval, initSyncData, networkError)

  const { data: validatorMetrics } = useSWRPolling<ValidatorMetricResult>(
    '/api/validator-metrics',
    { refreshInterval: epochInterval / 2, fallbackData: initValMetrics, networkError },
  )

  const { data: partialWithdrawals } = useSWRPolling<PartialWithdrawal[]>(
    '/api/partial-withdrawals',
    {
      refreshInterval: slotInterval,
      fallbackData: initPartialWithdrawals,
      networkError,
    },
  )

  const { data: pendingDeposits } = useSWRPolling<PendingDeposit[]>('/api/pending-deposits', {
    refreshInterval: slotInterval,
    fallbackData: initPendingDeposits,
    networkError,
  })

  const { data: forkVersionData } = useSWRPolling<ForkVersionData>('/api/fork-version', {
    refreshInterval: epochInterval / 2,
    fallbackData: initForkVersionData,
    networkError,
  })

  useEffect(() => {
    const loadBls = async () => {
      try {
        const blsModule = (await import('@chainsafe/bls/herumi')) as unknown as IBls
        setBlsModule(blsModule)
      } catch (error) {
        console.error('Failed to load BLS module:', error)
      }
    }
    void loadBls()
  }, [])

  const currentEpoch = syncData.beaconSync.currentEpoch
  const headSlot = syncData.beaconSync.headSlot
  const minValidatorWithdrawalDelay = Number(MIN_VALIDATOR_WITHDRAWABILITY_DELAY)

  useEffect(() => {
    setForkVersion(forkVersionData)
  }, [forkVersionData])

  // Initialize local active-only state based on existing exclusions
  useEffect(() => {
    setIsActiveOnlyMode(exclusionsMatchActiveOnly)
  }, [exclusionsMatchActiveOnly])

  const filteredValidatorStates = useMemo(() => {
    let filtered = validatorStates

    // Apply exclusions filter (for other exclusions that aren't active-only)
    if (!isActiveOnlyMode) {
      filtered = filtered.filter(({ status }) => !formattedExclusions.includes(status))
    }

    // Apply active-only filter using local state
    if (isActiveOnlyMode) {
      filtered = filtered.filter(({ status }) => activeStatuses.includes(status))
    }

    return filtered
  }, [validatorStates, formattedExclusions, isActiveOnlyMode, activeStatuses])

  const filteredValidators = useMemo(() => {
    return filteredValidatorStates.filter((validator) => {
      const query = search.toLowerCase()

      return (
        (validator.name || '').toLowerCase().includes(query) ||
        validator.pubKey.toLowerCase().includes(query) ||
        validator?.index?.toString().includes(query)
      )
    })
  }, [search, filteredValidatorStates])

  const rates = exchangeData?.data.rates

  const activeValidator = useMemo(() => {
    if (activeValId === undefined) return

    return validatorStates.find(({ index }) => Number(activeValId) === index)
  }, [activeValId, validatorStates])

  const eligibleToConsolidate = useMemo(() => {
    return validatorStates.filter(
      ({ withdrawalAddress }) =>
        !!withdrawalAddress &&
        (withdrawalAddress.includes('0x01') || withdrawalAddress.includes('0x02')),
    )
  }, [validatorStates])

  useEffect(() => {
    if (isRendered) return

    if (validatorIdSearchParam) {
      setValidatorId(Number(validatorIdSearchParam))
    }

    if (modalSearchParam === ValidatorModalView.DETAILS.toLowerCase()) {
      setValDetail(true)
    }

    if (modalSearchParam === ValidatorModalView.EDIT.toLowerCase()) {
      setIsEditValidator(true)
    }

    if (viewSearchParam) {
      setView(viewSearchParam.toUpperCase() as ValidatorManagementView)
    }

    setRender(true)
  }, [validatorIdSearchParam, isRendered, modalSearchParam, viewSearchParam])

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

  const changeView = (view: ValidatorManagementView) => {
    const baseUrl = '/dashboard/validators'
    setView(view)

    if (view === ValidatorManagementView.MAIN) {
      router.push(baseUrl)
      return
    }

    router.push(baseUrl + `?view=${view.toLowerCase()}`)
  }

  const goBack = () => {
    let backView = ValidatorManagementView.MAIN
    if (view === ValidatorManagementView.CREATE) {
      backView = ValidatorManagementView.ADD
    }

    changeView(backView)
  }
  const getPageTitle = (view: string) => {
    switch (view) {
      case ValidatorManagementView.CREATE:
        return t('validatorManagement.titles.create')
      case ValidatorManagementView.ADD:
        return t('validatorManagement.titles.add')
      case ValidatorManagementView.CONSOLIDATE:
        return 'Consolidate'
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
      case ValidatorManagementView.CONSOLIDATE:
        return (
          <ConsolidateView
            currentEpoch={currentEpoch}
            partialWithdrawals={partialWithdrawals}
            minValidatorWithdrawalDelay={minValidatorWithdrawalDelay}
            chainId={Number(DEPOSIT_CHAIN_ID)}
            validators={validatorStates}
          />
        )
      default:
        return (
          <MainView
            validators={filteredValidators}
            search={search}
            onSetSearch={setSearch}
            onChangeView={changeView}
            hasSearchAction={!!validatorStates.length}
            hasConsolidationAction={!!eligibleToConsolidate.length}
            scrollPercentage={scrollPercentage}
            isActiveOnlyMode={isActiveOnlyMode}
            onToggleActiveOnly={toggleActiveOnlyMode}
            totalValidatorCount={validatorStates.length}
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
        className='w-full flex flex-1 flex-col p-4 max-w-[100vw] md:max-w-[93vw] lg:max-w-[95vw]'
      >
        <>
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
          <BlsExecutionModal />
          {isValDetail && activeValidator && (
            <ValidatorModal
              chainId={Number(DEPOSIT_CHAIN_ID)}
              partialWithdrawals={partialWithdrawals}
              shardCommitteePeriod={Number(SHARD_COMMITTEE_PERIOD)}
              currentEpoch={currentEpoch}
              headSlot={headSlot}
              validator={activeValidator}
              pendingDeposits={pendingDeposits}
              validatorCacheData={validatorCache}
            />
          )}
          {isEditVal && activeValidator && (
            <EditValidatorModal
              validator={activeValidator}
              validatorCacheData={validatorCache}
              onClose={closeEditValModal}
            />
          )}
        </>
      </DashboardWrapper>
    </>
  )
}

export default Main
