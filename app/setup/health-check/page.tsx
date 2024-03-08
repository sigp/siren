import '../../../src/global.css'
import { fetchBeaconHealth, fetchBeaconSync, fetchExecutionSync } from '../../api/beacon';
import Wrapper from './Wrapper';

export default async function Page() {
  const healthData = await fetchBeaconHealth()
  const beaconSync = await fetchBeaconSync()
  const executionSync = await fetchExecutionSync()

  return (
    <Wrapper
      healthData={healthData.data}
      beaconSync={beaconSync.data}
      executionSync={executionSync.data}
    />
  )
}