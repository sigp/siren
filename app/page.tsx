import { fetchBeaconNodeVersion, fetchValidatorAuthKey } from './api/config';
import Wrapper from './Wrapper';
import '../src/global.css'

export default async function Page() {
  const version = await fetchBeaconNodeVersion()
  const apiKey = await fetchValidatorAuthKey()

  return (
    <Wrapper apiTokenPath={apiKey?.token_path} beaconNodeVersion={version?.data?.version}/>
  )
}