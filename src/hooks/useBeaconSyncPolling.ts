import { useEffect, useState } from 'react';
// import { useRecoilValue, useSetRecoilState } from 'recoil'
// import { beaconNetworkError, beaconSyncInfo, activeDevice } from '../recoil/atoms'
import useSWR from 'swr';
import swrGetFetcher from '../../utilities/swrGetFetcher';
import { BeaconSyncResult } from '../types/diagnostic';

const useBeaconSyncPolling = (initialData: BeaconSyncResult) => {
  // const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)

  const { data } = useSWR('/api/beacon-sync', swrGetFetcher, {refreshInterval: 12000})
  const [result, setResult] = useState<BeaconSyncResult>(initialData)
  // const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  // const setNetworkError = () => setBeaconNetworkError(true)


  useEffect(() => {
    if(data) {
      setResult(data.data)
    }
  }, [data])

  return {
    data: result
  }
}

export default useBeaconSyncPolling
