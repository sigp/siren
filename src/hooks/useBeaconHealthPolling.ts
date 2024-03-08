// import { useSetRecoilState } from 'recoil'
// import { beaconNetworkError } from '../recoil/atoms'
import useSWR from 'swr';
import swrGetFetcher from '../../utilities/swrGetFetcher';
import { HealthDiagnosticResult } from '../types/diagnostic';

const useBeaconHealthPolling = (initialData: HealthDiagnosticResult) => {


  // const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  // const setNetworkError = () => setBeaconNetworkError(true)

  return {
    data
  }
}

export default useBeaconHealthPolling
