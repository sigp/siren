import '../../../src/global.css'
import Wrapper from './Wrapper';
import { fetchBeaconHealth, fetchBeaconSync, fetchExecutionSync } from '../../api/beacon';

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