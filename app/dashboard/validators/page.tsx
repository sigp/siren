import '../../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../../utilities/getSessionCookie'
import { fetchActivities } from '../../api/activities'
import {
  fetchBeaconSpec,
  fetchForkVersion,
  fetchNodeHealth,
  fetchSyncData,
  fetchValidatorCountData,
} from '../../api/beacon'
import { fetchValidatorStatusExclusionList } from '../../api/config'
import {
  fetchPartialWithdrawals,
  fetchPendingDeposits,
  fetchValCaches,
  fetchValMetrics,
  fetchValStates,
} from '../../api/validator'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    // Use Promise.allSettled to handle temporary connection issues gracefully
    const results = await Promise.allSettled([
      fetchNodeHealth(token),
      fetchBeaconSpec(token),
      fetchValidatorCountData(token),
      fetchSyncData(token),
      fetchValStates(token),
      fetchValCaches(token),
      fetchValMetrics(token),
      fetchActivities({ token }),
      fetchForkVersion(token),
      fetchPartialWithdrawals(token),
      fetchPendingDeposits(token),
      fetchValidatorStatusExclusionList(token),
    ])

    const [
      bnHealthResult,
      beaconSpecResult,
      validatorCountResult,
      syncDataResult,
      statesResult,
      cachesResult,
      metricsResult,
      activitiesResult,
      forkVersionResult,
      partialWithdrawalsResult,
      pendingDepositsResult,
      exclusionsResult,
    ] = results

    // Only redirect if critical data (beaconSpec) fails
    if (beaconSpecResult.status === 'rejected') {
      console.error('Failed to fetch critical data, redirecting to error page')
      redirect('/error')
    }

    // Provide fallback data for non-critical fetches
    const bnHealth =
      bnHealthResult.status === 'fulfilled' ? bnHealthResult.value : { natOpen: false, upnp: false }
    const beaconSpec = beaconSpecResult.value
    const validatorCount =
      validatorCountResult.status === 'fulfilled'
        ? validatorCountResult.value
        : { active_ongoing: 0, active_exiting: 0, active_slashed: 0, pending: 0, exited: 0 }
    const syncData =
      syncDataResult.status === 'fulfilled'
        ? syncDataResult.value
        : { beaconSync: { isSyncing: false, syncDistance: 0, headSlot: 0 } }
    const states = statesResult.status === 'fulfilled' ? statesResult.value : []
    const caches = cachesResult.status === 'fulfilled' ? cachesResult.value : {}
    const metrics = metricsResult.status === 'fulfilled' ? metricsResult.value : []
    const activities = activitiesResult.status === 'fulfilled' ? activitiesResult.value : []
    const forkVersion =
      forkVersionResult.status === 'fulfilled'
        ? forkVersionResult.value
        : { previous_version: '', current_version: '', epoch: 0 }
    const partialWithdrawals =
      partialWithdrawalsResult.status === 'fulfilled' ? partialWithdrawalsResult.value : []
    const pendingDeposits =
      pendingDepositsResult.status === 'fulfilled' ? pendingDepositsResult.value : []
    const exclusions = exclusionsResult.status === 'fulfilled' ? exclusionsResult.value : []

    return (
      <Wrapper
        initForkVersionData={forkVersion}
        initActivityData={activities}
        initValMetrics={metrics}
        initExclusionData={exclusions}
        initNodeHealth={bnHealth}
        initSyncData={syncData}
        initValStates={states}
        initValCaches={caches}
        initValidatorCountData={validatorCount}
        beaconSpec={beaconSpec}
        initPartialWithdrawals={partialWithdrawals}
        initPendingDeposits={pendingDeposits}
      />
    )
  } catch (_) {
    redirect('/error')
  }
}
