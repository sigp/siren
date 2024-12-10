'use client'

import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import pckJson from '../../package.json'
import AccountEarning from '../../src/components/AccountEarnings/AccountEarning'
import AppGreeting from '../../src/components/AppGreeting/AppGreeting'
import DashboardWrapper from '../../src/components/DashboardWrapper/DashboardWrapper'
import DiagnosticTable from '../../src/components/DiagnosticTable/DiagnosticTable'
import NetworkStats from '../../src/components/NetworkStats/NetworkStats'
import ValidatorBalances from '../../src/components/ValidatorBalances/ValidatorBalances'
import ValidatorTable from '../../src/components/ValidatorTable/ValidatorTable'
import { ALERT_ID, CoinbaseExchangeRateUrl } from '../../src/constants/constants'
import useDiagnosticAlerts from '../../src/hooks/useDiagnosticAlerts'
import useLocalStorage from '../../src/hooks/useLocalStorage'
import useNetworkMonitor from '../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../src/hooks/useSWRPolling'
import { exchangeRates, proposerDuties } from '../../src/recoil/atoms'
import { ActivityResponse, LogMetric, ProposerDuty, StatusColor } from '../../src/types'
import { BeaconNodeSpecResults, SyncData } from '../../src/types/beacon'
import { Diagnostics, PeerDataResults } from '../../src/types/diagnostic'
import { ValidatorCache, ValidatorInclusionData, ValidatorInfo } from '../../src/types/validator'
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
  initLogMetrics: LogMetric
  initActivityData: ActivityResponse
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
    initLogMetrics,
    initActivityData,
  } = props

  const { t } = useTranslation()
  const { SECONDS_PER_SLOT, SLOTS_PER_EPOCH } = beaconSpec
  const { version } = pckJson
  const { updateAlert, storeAlert, removeAlert } = useDiagnosticAlerts()
  const [username] = useLocalStorage<string>('username', 'Keeper')
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

  const { data: logMetrics } = useSWRPolling<LogMetric>('/api/priority-logs', {
    refreshInterval: slotInterval / 2,
    fallbackData: initLogMetrics,
    networkError,
  })

  const { beaconSync, executionSync } = syncData
  const { isSyncing } = beaconSync
  const { isReady } = executionSync
  const { connected } = peerData
  const { natOpen } = nodeHealth
  const warningCount = logMetrics.warningLogs?.length || 0

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
    if (isReady) {
      removeAlert(ALERT_ID.VALIDATOR_SYNC)
      return
    }

    storeAlert({
      id: ALERT_ID.VALIDATOR_SYNC,
      severity: StatusColor.WARNING,
      subText: t('fair'),
      message: t('alertMessages.ethClientNotSync'),
    })
  }, [t, isReady, storeAlert, removeAlert])

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

  return (
    <DashboardWrapper
      initActivityData={initActivityData}
      syncData={syncData}
      nodeHealth={nodeHealth}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
    >
      <div className='w-full grid grid-cols-1 lg:grid-cols-12 h-full items-center justify-center'>
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
          <ValidatorBalances
            validatorCacheData={validatorCache}
            validatorStateInfo={validatorStates}
            genesisTime={genesisTime}
          />
        </div>
        <div className='flex flex-col col-span-6 xl:col-span-7 h-full py-2 px-4'>
          <NetworkStats
            peerData={peerData}
            syncData={syncData}
            nodeHealth={nodeHealth}
            valInclusionData={valInclusion}
          />
          <ValidatorTable validators={validatorStates} className='mt-8 lg:mt-2' />
          <DiagnosticTable
            metrics={logMetrics}
            bnSpec={beaconSpec}
            syncData={syncData}
            beanHealth={nodeHealth}
          />
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default Main
