import '../../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../../utilities/getSessionCookie'
import { fetchActivities } from '../../api/activities'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import {
  fetchBeaconNodeVersion,
  fetchValidatorStatusExclusionList,
  fetchValidatorVersion,
} from '../../api/config'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    // Use Promise.allSettled to handle temporary connection issues gracefully
    const results = await Promise.allSettled([
      fetchBeaconSpec(token),
      fetchSyncData(token),
      fetchNodeHealth(token),
      fetchBeaconNodeVersion(token),
      fetchValidatorVersion(token),
      fetchActivities({ token }),
      fetchValidatorStatusExclusionList(token),
    ])

    const [
      beaconSpecResult,
      syncDataResult,
      nodeHealthResult,
      bnVersionResult,
      lighthouseVersionResult,
      activitiesResult,
      exclusionsResult,
    ] = results

    // Only redirect if critical data (beaconSpec) fails
    if (beaconSpecResult.status === 'rejected') {
      console.error('Failed to fetch critical data, redirecting to error page')
      redirect('/error')
    }

    // Provide fallback data for non-critical fetches
    const beaconSpec = beaconSpecResult.value
    const syncData =
      syncDataResult.status === 'fulfilled'
        ? syncDataResult.value
        : { beaconSync: { isSyncing: false, syncDistance: 0, headSlot: 0 } }
    const nodeHealth =
      nodeHealthResult.status === 'fulfilled'
        ? nodeHealthResult.value
        : { natOpen: false, upnp: false }
    const bnVersion =
      bnVersionResult.status === 'fulfilled' ? bnVersionResult.value : { version: 'Unknown' }
    const lighthouseVersion =
      lighthouseVersionResult.status === 'fulfilled'
        ? lighthouseVersionResult.value
        : { version: 'Unknown' }
    const activities = activitiesResult.status === 'fulfilled' ? activitiesResult.value : []
    const exclusions = exclusionsResult.status === 'fulfilled' ? exclusionsResult.value : []

    return (
      <Wrapper
        initExclusionList={exclusions}
        initActivityData={activities}
        initSyncData={syncData}
        beaconSpec={beaconSpec}
        initNodeHealth={nodeHealth}
        lighthouseVersion={lighthouseVersion.version}
        bnVersion={bnVersion.version}
      />
    )
  } catch (_) {
    redirect('/error')
  }
}
