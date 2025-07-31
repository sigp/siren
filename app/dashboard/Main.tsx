'use client'

import axios from 'axios'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import pckJson from '../../package.json'
import AccountEarning from '../../src/components/AccountEarnings/AccountEarning'
import AppGreeting from '../../src/components/AppGreeting/AppGreeting'
import DashboardWrapper from '../../src/components/DashboardWrapper/DashboardWrapper'
import DiagnosticTable from '../../src/components/DiagnosticTable/DiagnosticTable'
import ValidatorBalanceEmptyState from '../../src/components/EmptyState/ValidatorBalanceEmptyState'
import ValidatorTableEmptyState from '../../src/components/EmptyState/ValidatorTableEmptyState'
import EpochProgressBar from '../../src/components/EpochProgressBar/EpochProgressBar'
import NetworkStats from '../../src/components/NetworkStats/NetworkStats'
import Toggle from '../../src/components/Toggle/Toggle'
import ValidatorBalances from '../../src/components/ValidatorBalances/ValidatorBalances'
import ValidatorTable from '../../src/components/ValidatorTable/ValidatorTable'
import { ALERT_ID, CoinbaseExchangeRateUrl } from '../../src/constants/constants'
import useDiagnosticAlerts from '../../src/hooks/useDiagnosticAlerts'
import useLocalStorage from '../../src/hooks/useLocalStorage'
import useNetworkMonitor from '../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../src/hooks/useSWRPolling'
import useValidatorExclusionList from '../../src/hooks/useValidatorExclusionList'
import { exchangeRates, proposerDuties } from '../../src/recoil/atoms'
import {
  ActivityResponse,
  ExcludedStatus,
  LogData,
  Metric,
  ProposerDuty,
  StatusColor,
} from '../../src/types'
import { BeaconNodeSpecResults, SyncData } from '../../src/types/beacon'
import { Diagnostics, PeerDataResults } from '../../src/types/diagnostic'
import {
  ValidatorCache,
  ValidatorInclusionData,
  ValidatorInfo,
  ValidatorStatus,
} from '../../src/types/validator'
import formatUniqueObjectArray from '../../utilities/formatUniqueObjectArray'

export interface MainProps {
  initNodeHealth: Diagnostics
  initSyncData: SyncData
  bnVersion: string
  lighthouseVersion: string
  beaconSpec: BeaconNodeSpecResults
  initValStates: ValidatorInfo[]
  genesisTime: number
  initPeerData: PeerDataResults
  initValCaches: ValidatorCache
  initInclusionRate: ValidatorInclusionData
  initProposerDuties: ProposerDuty[]
  initActivityData: ActivityResponse
  initMetrics: Metric
  initPriorityLogs: LogData[]
  initExclusionData: ExcludedStatus[]
}

const Main: FC<MainProps> = (props) => {
  const {
    initNodeHealth,
    initSyncData,
    initValStates,
    initValCaches,
    initPeerData,
    initInclusionRate,
    beaconSpec,
    bnVersion,
    lighthouseVersion,
    genesisTime,
    initProposerDuties,
    initActivityData,
    initMetrics,
    initPriorityLogs,
    initExclusionData,
  } = props

  const { t } = useTranslation()
  const { SECONDS_PER_SLOT, SLOTS_PER_EPOCH } = beaconSpec
  const { version } = pckJson
  const { updateAlert, storeAlert, removeAlert } = useDiagnosticAlerts()
  const [username] = useLocalStorage<string>('username', 'Keeper')
  const [validatorHeightRatio, setValidatorHeightRatio] = useLocalStorage<number>(
    'validatorHeightRatio',
    0.5,
  )

  const setExchangeRate = useSetRecoilState(exchangeRates)
  const setDuties = useSetRecoilState(proposerDuties)

  const { isValidatorError, isBeaconError } = useNetworkMonitor()

  const networkError = isValidatorError || isBeaconError
  const slotInterval = SECONDS_PER_SLOT * 1000
  const halfEpochInterval = ((Number(SECONDS_PER_SLOT) * Number(SLOTS_PER_EPOCH)) / 2) * 1000

  const { data: exchangeData } = useSWRPolling(CoinbaseExchangeRateUrl, {
    refreshInterval: 60 * 1000,
    networkError,
  })

  const { formattedExclusions, exclusions, setExclusions } =
    useValidatorExclusionList(initExclusionData)

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

  const isActiveOnlyMode = useMemo(() => {
    return (
      nonActiveStatuses.every((status) => formattedExclusions.includes(status)) &&
      activeStatuses.some((status) => !formattedExclusions.includes(status))
    )
  }, [formattedExclusions])

  const toggleActiveOnlyMode = async () => {
    try {
      if (isActiveOnlyMode) {
        // Switch to show all validators by removing all exclusions
        const deletePromises = exclusions.map((exclusion) =>
          axios.delete(`/api/remove-exclusion/${exclusion.id}`),
        )
        await Promise.all(deletePromises)
        // Refresh exclusions
        const { data } = await axios.get('/api/exclusions')
        setExclusions(data)
      } else {
        // Switch to active only: first clear all exclusions, then add non-active exclusions
        // This ensures we start from a clean state regardless of current exclusions
        const deletePromises = exclusions.map((exclusion) =>
          axios.delete(`/api/remove-exclusion/${exclusion.id}`),
        )
        await Promise.all(deletePromises)

        // Now add exclusions for all non-active statuses
        const addPromises = nonActiveStatuses.map((status) =>
          axios.post('/api/add-exclusion', { status }),
        )
        await Promise.all(addPromises)

        // Refresh exclusions
        const { data } = await axios.get('/api/exclusions')
        setExclusions(data)
      }
    } catch (error) {
      console.error('Failed to toggle active only mode:', error)
    }
  }

  const { data: peerData } = useSWRPolling<PeerDataResults>('/api/peer-data', {
    refreshInterval: slotInterval,
    fallbackData: initPeerData,
    networkError,
  })
  const { data: validatorCache } = useSWRPolling<ValidatorCache>('/api/validator-cache', {
    refreshInterval: slotInterval / 2,
    fallbackData: initValCaches,
    networkError,
  })
  const { data: validatorStates } = useSWRPolling<ValidatorInfo[]>('/api/validator-states', {
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
  const { data: valInclusion } = useSWRPolling<ValidatorInclusionData>('/api/validator-inclusion', {
    refreshInterval: slotInterval,
    fallbackData: initInclusionRate,
    networkError,
  })

  const { data: valDuties } = useSWRPolling<ProposerDuty[]>('/api/validator-duties', {
    refreshInterval: halfEpochInterval,
    fallbackData: initProposerDuties,
    networkError,
  })

  const { data: metrics } = useSWRPolling<Metric>('/api/log-metrics', {
    refreshInterval: slotInterval / 2,
    fallbackData: initMetrics,
    networkError,
  })

  const { beaconSync } = syncData
  const { isSyncing } = beaconSync
  const { connected } = peerData
  const { natOpen } = nodeHealth
  const warningCount = metrics.warningCount || 0

  // Calculate optimal height ratio based on validator count
  // Metrics must get minimum 35%, so validators can get maximum 65%
  const optimalHeightRatio = useMemo(() => {
    const validatorCount = validatorStates.length
    if (validatorCount <= 4) {
      return 0.4 // Show less validator space when few validators
    } else if (validatorCount <= 10) {
      return 0.5 // Default ratio for moderate validator count
    } else {
      return 0.65 // Show more validator space when many validators (but leave 35% for metrics)
    }
  }, [validatorStates.length])

  // Use a stable height ratio to prevent hydration mismatches
  const [currentHeightRatio, setCurrentHeightRatio] = useState(0.5)
  const [isDragging, setIsDragging] = useState(false)

  // Update height ratio after hydration to prevent server-client mismatches
  // Don't update during dragging to prevent flickering
  useEffect(() => {
    if (!isDragging) {
      const storedRatio = validatorHeightRatio || optimalHeightRatio
      const clampedRatio = Math.max(0.35, Math.min(0.65, storedRatio))
      setCurrentHeightRatio(clampedRatio)
    }
  }, [validatorHeightRatio, optimalHeightRatio, isDragging])

  // Update stored ratio when optimal changes (but allow user overrides)
  useEffect(() => {
    if (validatorHeightRatio != null && Math.abs(validatorHeightRatio - optimalHeightRatio) < 0.1) {
      setValidatorHeightRatio(optimalHeightRatio)
    }
  }, [optimalHeightRatio, validatorHeightRatio, setValidatorHeightRatio])

  useEffect(() => {
    setDuties((prev) => formatUniqueObjectArray([...prev, ...valDuties]))
  }, [valDuties])

  useEffect(() => {
    if (exchangeData) {
      const { rates } = exchangeData.data
      setExchangeRate({
        rates,
        currencies: Object.keys(rates),
      })
    }
  }, [t, exchangeData, setExchangeRate])

  useEffect(() => {
    if (!isSyncing) {
      removeAlert(ALERT_ID.BEACON_SYNC)
      return
    }

    storeAlert({
      id: ALERT_ID.BEACON_SYNC,
      severity: StatusColor.WARNING,
      subText: t('fair'),
      message: t('alertMessages.beaconNotSync'),
    })
  }, [t, isSyncing, storeAlert, removeAlert])

  useEffect(() => {
    if (connected <= 50) {
      if (connected <= 20) {
        updateAlert({
          message: t('alert.peerCountLow', { type: t('alert.type.nodeValidator') }),
          subText: t('poor'),
          severity: StatusColor.ERROR,
          id: ALERT_ID.PEER_COUNT,
        })
        return
      }
      updateAlert({
        message: t('alert.peerCountMedium', { type: t('alert.type.nodeValidator') }),
        subText: t('fair'),
        severity: StatusColor.WARNING,
        id: ALERT_ID.PEER_COUNT,
      })
    }
  }, [t, connected, updateAlert])

  useEffect(() => {
    if (natOpen) {
      removeAlert(ALERT_ID.NAT)
      return
    }

    storeAlert({
      id: ALERT_ID.NAT,
      message: t('alert.natClosedStatus', { type: t('alert.type.network') }),
      subText: t('poor'),
      severity: StatusColor.ERROR,
    })
  }, [t, natOpen, storeAlert, removeAlert])

  useEffect(() => {
    if (warningCount > 5) {
      storeAlert({
        id: ALERT_ID.WARNING_LOG,
        message: t('alertMessages.excessiveWarningLogs'),
        severity: StatusColor.WARNING,
        subText: t('fair'),
      })

      return
    }

    removeAlert(ALERT_ID.WARNING_LOG)
  }, [warningCount, storeAlert, removeAlert])

  const filteredValidatorStates = useMemo(() => {
    return validatorStates.filter(({ status }) => !formattedExclusions.includes(status))
  }, [validatorStates, formattedExclusions])

  return (
    <DashboardWrapper
      initActivityData={initActivityData}
      syncData={syncData}
      nodeHealth={nodeHealth}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
    >
      <div className='w-full grid grid-cols-1 lg:grid-cols-12 h-full items-stretch overflow-hidden'>
        <div className='col-span-6 xl:col-span-5 flex flex-col h-full p-4 lg:p-0'>
          <AppGreeting
            userName={username}
            vcVersion={lighthouseVersion}
            bnVersion={bnVersion}
            sirenVersion={version}
          />
          <AccountEarning
            validatorCacheData={validatorCache}
            validatorStateInfo={validatorStates}
          />
          {validatorStates.length && Object.keys(validatorCache).length ? (
            <ValidatorBalances
              validatorCacheData={validatorCache}
              validatorStateInfo={validatorStates}
              genesisTime={genesisTime}
            />
          ) : (
            <ValidatorBalanceEmptyState />
          )}
        </div>
        <div className='flex flex-col col-span-6 xl:col-span-7 h-full py-2 px-4 min-h-0'>
          <NetworkStats
            peerData={peerData}
            syncData={syncData}
            nodeHealth={nodeHealth}
            valInclusionData={valInclusion}
          />
          <EpochProgressBar syncData={syncData} beaconSpec={beaconSpec} />
          <div
            className='flex flex-col mt-6 lg:mt-1 min-h-0'
            style={{ height: 'calc(100% - 50px)' }}
          >
            <div
              className='flex flex-col relative min-h-0 overflow-hidden'
              style={{ height: `${currentHeightRatio * 100}%` }}
            >
              <div className='flex items-center mb-2 flex-shrink-0'>
                <div className='flex items-center space-x-3'>
                  <span className='text-sm font-medium text-dark900 dark:text-dark300'>
                    Show Active Only
                  </span>
                  <Toggle
                    id='active-only-toggle'
                    value={isActiveOnlyMode}
                    onChange={() => toggleActiveOnlyMode()}
                  />
                </div>
              </div>
              <div className='flex-1 min-h-0 overflow-y-auto overflow-x-hidden'>
                {filteredValidatorStates.length ? (
                  <ValidatorTable validators={filteredValidatorStates} />
                ) : validatorStates.length ? (
                  <ValidatorTableEmptyState
                    title={t('emptyState.filteredValidatorTable.nonFound')}
                    text={t('emptyState.filteredValidatorTable.adjustFilter')}
                    className='h-full min-h-60'
                  />
                ) : (
                  <ValidatorTableEmptyState
                    title={t('emptyState.validatorTable.noConnections')}
                    text={t('emptyState.validatorTable.importOrDeposit')}
                    href='/dashboard/validators?view=create'
                    btnFontType='text-caption1.5'
                    className='h-full min-h-60'
                    ctaText='Create Validator'
                  />
                )}
              </div>
            </div>
            <div
              className='flex items-center justify-center py-1 cursor-row-resize bg-transparent hover:bg-dark100 dark:hover:bg-dark700 border-t border-b border-style500 flex-shrink-0 transition-all duration-200 group'
              onMouseDown={(e) => {
                const startY = e.clientY
                const startHeight = currentHeightRatio
                let hasDragStarted = false
                let finalHeight = startHeight

                // Ensure the stored ratio matches the current visual ratio to prevent jumping
                setValidatorHeightRatio(currentHeightRatio)

                // Get container dimensions once at the start
                const container = document.querySelector(
                  '[style*="calc(100% - 50px)"]',
                ) as HTMLElement
                if (!container) return

                const containerRect = container.getBoundingClientRect()
                const containerHeight = containerRect.height

                const handleMouseMove = (e: MouseEvent) => {
                  if (!hasDragStarted) {
                    // Only start dragging after a small movement threshold
                    const deltaY = Math.abs(e.clientY - startY)
                    if (deltaY < 2) return
                    hasDragStarted = true
                    setIsDragging(true)
                    document.body.style.cursor = 'row-resize'
                    document.body.style.userSelect = 'none'
                  }

                  const deltaY = e.clientY - startY

                  // Calculate proportional height change
                  const heightChange = deltaY / containerHeight
                  let newHeight = startHeight + heightChange

                  // Enforce boundaries with some buffer to prevent flickering
                  const minHeight = 0.35 // 35% minimum for metrics
                  const maxHeight = 0.65 // 65% maximum for validators

                  // Clamp to boundaries
                  newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))
                  finalHeight = newHeight

                  // Only update the current height ratio during dragging
                  // Don't update localStorage until mouse up to prevent flickering
                  setCurrentHeightRatio(newHeight)
                }

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                  document.body.style.cursor = 'default'
                  document.body.style.userSelect = 'auto'
                  setIsDragging(false)

                  // Update localStorage with final position
                  if (hasDragStarted) {
                    setValidatorHeightRatio(finalHeight)
                  }
                }

                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
              style={{ height: '8px' }}
            >
              <div className='flex items-center gap-0.5 text-dark300 dark:text-dark600 group-hover:text-dark600 dark:group-hover:text-dark400 transition-colors duration-200'>
                <div className='w-3 h-0.5 bg-current rounded-full'></div>
                <div className='w-3 h-0.5 bg-current rounded-full'></div>
                <div className='w-3 h-0.5 bg-current rounded-full'></div>
              </div>
            </div>
            <div
              className='flex flex-col min-h-0 overflow-hidden'
              style={{
                height: `${(1 - currentHeightRatio) * 100}%`,
                minHeight: '35%',
              }}
            >
              <div className='flex-1 min-h-0 overflow-hidden'>
                <DiagnosticTable
                  priorityLogs={initPriorityLogs}
                  logMetrics={metrics}
                  bnSpec={beaconSpec}
                  syncData={syncData}
                  beanHealth={nodeHealth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default Main
