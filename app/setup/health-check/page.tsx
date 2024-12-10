import '../../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../../utilities/getSessionCookie'
import { fetchBeaconSpec, fetchNodeHealth, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    const nodeHealth = await fetchNodeHealth(token)
    const beaconSpec = await fetchBeaconSpec(token)
    const syncData = await fetchSyncData(token)

    return <Wrapper initNodeHealth={nodeHealth} beaconSpec={beaconSpec} initSyncData={syncData} />
  } catch (e) {
    redirect('/error')
  }
}
