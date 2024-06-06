import '../../../src/global.css'
import { redirect } from 'next/navigation';
import getSessionCookie from '../../../utilities/getSessionCookie';
import { fetchBeaconSpec, fetchSyncData } from '../../api/beacon'
import Wrapper from './Wrapper'

export default async function Page() {
  const token = getSessionCookie()

  const beaconSpec = await fetchBeaconSpec(token)
  const syncData = await fetchSyncData(token)

  if(syncData.beaconSync.beaconPercentage >= 95) {
    redirect('/dashboard')
  }

  return <Wrapper beaconSpec={beaconSpec} initSyncData={syncData} />
}
