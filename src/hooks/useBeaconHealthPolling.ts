import { useRecoilValue, useSetRecoilState } from 'recoil';
import { beaconHealthResult, beaconHealthSyncInterval, beaconNodeEndpoint } from '../recoil/atoms';
import formatHealthEndpoint from '../utilities/formatHealthEndpoint';
import usePollApi from './usePollApi';
import { useEffect } from 'react';

const useBeaconHealthPolling = (time = 6000) => {
  const beaconEndpoint = useRecoilValue(beaconNodeEndpoint);
  const url = formatHealthEndpoint(beaconEndpoint);
  const setHealth = useSetRecoilState(beaconHealthResult)

  const { response } = usePollApi({
    time,
    isReady: !!url,
    intervalState: beaconHealthSyncInterval,
    url
  });

  useEffect(() => {
    setHealth(response?.data.data)
  }, [response])
}

export default useBeaconHealthPolling