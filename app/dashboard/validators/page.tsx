import '../../../src/global.css'
import { redirect } from 'next/navigation';
import getSessionCookie from '../../../utilities/getSessionCookie';
import {
  fetchBeaconSpec,
  fetchNodeHealth,
  fetchSyncData,
  fetchValidatorCountData,
} from '../../api/beacon'
import { fetchValCaches, fetchValMetrics, fetchValStates } from '../../api/validator';
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    const bnHealth = await fetchNodeHealth(token)
    const beaconSpec = await fetchBeaconSpec(token)
    const validatorCount = await fetchValidatorCountData(token)
    const syncData = await fetchSyncData(token)
    const states = await fetchValStates(token)
    const caches = await fetchValCaches(token)
    const metrics = await fetchValMetrics(token)

    return (
      <Wrapper
        initValMetrics={metrics}
        initNodeHealth={bnHealth}
        initSyncData={syncData}
        initValStates={states}
        initValCaches={caches}
        initValidatorCountData={validatorCount}
        beaconSpec={beaconSpec}
      />
    )
  } catch (e) {
    redirect('/error')
  }
}
