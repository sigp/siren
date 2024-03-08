import { useEffect, useState } from 'react';
// import { useRecoilValue, useSetRecoilState } from 'recoil'
// import { activeDevice, validatorSyncInfo } from '../recoil/atoms'
// import { selectBnSpec } from '../recoil/selectors/selectBnSpec'
import useSWR from 'swr';
import swrGetFetcher from '../../utilities/swrGetFetcher';
import { ValidatorSyncResult } from '../types/diagnostic';

const useValidatorSyncPolling = (initialData: ValidatorSyncResult) => {
  // const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const [results, setResults] = useState<ValidatorSyncResult>(initialData)
  // const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const { data } = useSWR('/api/execution-sync', swrGetFetcher, {refreshInterval: 12000})

  // const setNetworkError = () => setBeaconNetworkError(true)

  useEffect(() => {
    if(data) {
      setResults(data.data)
    }
  }, [data])

  return {
    data: results
  }
}

export default useValidatorSyncPolling
