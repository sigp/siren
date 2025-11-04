import '../../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../../utilities/getSessionCookie'
import { fetchBeaconSpec, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    // Use Promise.allSettled to handle temporary connection issues gracefully
    const results = await Promise.allSettled([fetchBeaconSpec(token), fetchSyncData(token)])

    const [beaconSpecResult, syncDataResult] = results

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

    return <Wrapper beaconSpec={beaconSpec} initSyncData={syncData} />
  } catch (_) {
    redirect('/error')
  }
}
