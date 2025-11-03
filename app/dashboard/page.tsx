import '../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../utilities/getSessionCookie'
import { fetchActivities } from '../api/activities'
import {
  fetchBeaconSpec,
  fetchInclusionRate,
  fetchNodeHealth,
  fetchPeerData,
  fetchProposerDuties,
  fetchSyncData,
} from '../api/beacon'
import {
  fetchBeaconNodeVersion,
  fetchGenesisData,
  fetchValidatorStatusExclusionList,
  fetchValidatorVersion,
} from '../api/config'
import { fetchMetrics, fetchPriorityLogs } from '../api/logs'
import { fetchValCaches, fetchValStates } from '../api/validator'
import Wrapper from './Wrapper'

export default async function Page() {
  const token = getSessionCookie()

  if (!token) {
    redirect('/error')
  }

  try {
    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled([
      fetchBeaconSpec(token),
      fetchGenesisData(token),
      fetchPeerData(token),
      fetchSyncData(token),
      fetchNodeHealth(token),
      fetchValStates(token),
      fetchValidatorStatusExclusionList(token),
      fetchValCaches(token),
      fetchInclusionRate(token),
      fetchBeaconNodeVersion(token),
      fetchValidatorVersion(token),
      fetchProposerDuties(token),
      fetchActivities({ token }),
      fetchMetrics(token),
      fetchPriorityLogs({ token }),
    ])

    // Extract results with fallbacks for failed fetches
    const [
      beaconSpecResult,
      genesisBlockResult,
      peerDataResult,
      syncDataResult,
      nodeHealthResult,
      statesResult,
      exclusionsResult,
      cachesResult,
      inclusionResult,
      bnVersionResult,
      lighthouseVersionResult,
      proposerDutiesResult,
      activitiesResult,
      metricsResult,
      priorityLogsResult,
    ] = results

    // For critical data that's needed for the app to function, redirect on failure
    if (beaconSpecResult.status === 'rejected' || genesisBlockResult.status === 'rejected') {
      console.error('Failed to fetch critical data, redirecting to error page')
      redirect('/error')
    }

    // Provide fallback data for non-critical fetches
    const beaconSpec = beaconSpecResult.value
    const genesisBlock = genesisBlockResult.value
    const peerData =
      peerDataResult.status === 'fulfilled'
        ? peerDataResult.value
        : { connected: 0, connecting: 0, disconnected: 0, disconnecting: 0 }
    const syncData =
      syncDataResult.status === 'fulfilled'
        ? syncDataResult.value
        : { beaconSync: { isSyncing: false, syncDistance: 0, headSlot: 0 } }
    const nodeHealth =
      nodeHealthResult.status === 'fulfilled'
        ? nodeHealthResult.value
        : { natOpen: false, upnp: false }
    const states = statesResult.status === 'fulfilled' ? statesResult.value : []
    const exclusions = exclusionsResult.status === 'fulfilled' ? exclusionsResult.value : []
    const caches = cachesResult.status === 'fulfilled' ? cachesResult.value : {}
    const inclusion =
      inclusionResult.status === 'fulfilled'
        ? inclusionResult.value
        : {
            data: {
              global_inclusion_rate: 0,
              previous_epoch_active_validators: 0,
              previous_epoch_included_validators: 0,
            },
          }
    const bnVersion =
      bnVersionResult.status === 'fulfilled' ? bnVersionResult.value : { version: 'Unknown' }
    const lighthouseVersion =
      lighthouseVersionResult.status === 'fulfilled'
        ? lighthouseVersionResult.value
        : { version: 'Unknown' }
    const proposerDuties =
      proposerDutiesResult.status === 'fulfilled' ? proposerDutiesResult.value : []
    const activities = activitiesResult.status === 'fulfilled' ? activitiesResult.value : []
    const metrics =
      metricsResult.status === 'fulfilled'
        ? metricsResult.value
        : { critCount: 0, warnCount: 0, errorCount: 0, warningCount: 0 }
    const priorityLogs = priorityLogsResult.status === 'fulfilled' ? priorityLogsResult.value : []

    return (
      <Wrapper
        initActivityData={activities}
        initExclusionData={exclusions}
        initProposerDuties={proposerDuties}
        initValCaches={caches}
        initValStates={states}
        initNodeHealth={nodeHealth}
        initSyncData={syncData}
        initInclusionRate={inclusion}
        initPeerData={peerData}
        genesisTime={genesisBlock}
        lighthouseVersion={lighthouseVersion.version}
        bnVersion={bnVersion.version}
        beaconSpec={beaconSpec}
        initMetrics={metrics}
        initPriorityLogs={priorityLogs}
      />
    )
  } catch (e) {
    console.error('Unexpected error in dashboard page:', e)
    redirect('/error')
  }
}
