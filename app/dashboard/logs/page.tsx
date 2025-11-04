import '../../../src/global.css'
import { redirect } from 'next/navigation'
import { LogType } from '../../../src/types'
import getSessionCookie from '../../../utilities/getSessionCookie'
import { fetchActivities } from '../../api/activities'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import { fetchLogMetrics, fetchMetrics } from '../../api/logs'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()
    const defaultLogType = LogType.BEACON

    // Use Promise.allSettled to handle temporary connection issues gracefully
    const results = await Promise.allSettled([
      fetchLogMetrics(token),
      fetchBeaconSpec(token),
      fetchSyncData(token),
      fetchNodeHealth(token),
      fetchActivities({ token }),
      fetchMetrics(token, defaultLogType),
    ])

    const [
      logMetricsResult,
      beaconSpecResult,
      syncDataResult,
      nodeHealthResult,
      activitiesResult,
      metricsResult,
    ] = results

    // Only redirect if critical data (beaconSpec) fails
    if (beaconSpecResult.status === 'rejected') {
      console.error('Failed to fetch critical data, redirecting to error page')
      redirect('/error')
    }

    // Provide fallback data for non-critical fetches
    const logMetrics =
      logMetricsResult.status === 'fulfilled' ? logMetricsResult.value : { beacon: 0, validator: 0 }
    const beaconSpec = beaconSpecResult.value
    const syncData =
      syncDataResult.status === 'fulfilled'
        ? syncDataResult.value
        : { beaconSync: { isSyncing: false, syncDistance: 0, headSlot: 0 } }
    const nodeHealth =
      nodeHealthResult.status === 'fulfilled'
        ? nodeHealthResult.value
        : { natOpen: false, upnp: false }
    const activities = activitiesResult.status === 'fulfilled' ? activitiesResult.value : []
    const metrics =
      metricsResult.status === 'fulfilled'
        ? metricsResult.value
        : { critCount: 0, warnCount: 0, errorCount: 0, warningCount: 0 }

    return (
      <Wrapper
        initMetrics={metrics}
        defaultLogType={defaultLogType}
        initActivityData={activities}
        initLogMetrics={logMetrics}
        initSyncData={syncData}
        beaconSpec={beaconSpec}
        initNodeHealth={nodeHealth}
      />
    )
  } catch (_) {
    redirect('/error')
  }
}
