import '../../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../../utilities/getSessionCookie'
import { fetchActivities } from '../../api/activities'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import { fetchBeaconNodeVersion, fetchValidatorVersion } from '../../api/config'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    const beaconSpec = await fetchBeaconSpec(token)
    const syncData = await fetchSyncData(token)
    const nodeHealth = await fetchNodeHealth(token)
    const bnVersion = await fetchBeaconNodeVersion(token)
    const lighthouseVersion = await fetchValidatorVersion(token)
    const activities = await fetchActivities({ token })

    return (
      <Wrapper
        initActivityData={activities}
        initSyncData={syncData}
        beaconSpec={beaconSpec}
        initNodeHealth={nodeHealth}
        lighthouseVersion={lighthouseVersion.version}
        bnVersion={bnVersion.version}
      />
    )
  } catch (e) {
    redirect('/error')
  }
}
