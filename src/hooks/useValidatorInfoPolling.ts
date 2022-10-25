import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import usePollingInterval from './usePollingInterval'
import { secondsInSlot, slotsInEpoc } from '../constants/constants';
import { fetchValidatorStatuses } from '../api/beacon'
import { useEffect } from 'react'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { validatorInfoInterval, validatorIntervalIncrement, validatorStateInfo } from '../recoil/atoms';
import { Validator } from '../types/validator'

const useValidatorInfoPolling = () => {
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const { contents: validators, state } = useRecoilValueLoadable(selectValidators)
  const setStateInfo = useSetRecoilState(validatorStateInfo)
  const setIncrement = useSetRecoilState(validatorIntervalIncrement)
  const [validatorInterval, setInterval] = useRecoilState(validatorInfoInterval)
  const isSkip = Boolean(validatorInterval)

  const fetchValidatorInfo = async () => {
    if (!baseBeaconUrl || !validators) return

    const beaconValidators = await fetchValidatorStatuses(
      baseBeaconUrl,
      validators.map((validator: Validator) => validator.pubKey).join(','),
    )

    setStateInfo(beaconValidators.data.data)
    setIncrement(prev => {
      const nextInterval = prev + 1;
      return nextInterval > slotsInEpoc ? 1 : nextInterval
    })
  }
  const onClearInterval = () => setInterval(undefined)

  useEffect(() => {
    if (state === 'hasValue') {
      void fetchValidatorInfo()
    }
  }, [state])

  const { intervalId } = usePollingInterval(fetchValidatorInfo, secondsInSlot * 1000, {
    isSkip,
    onClearInterval,
  })

  useEffect(() => {
    if (intervalId) {
      setInterval(intervalId)
    }
  }, [intervalId])
}

export default useValidatorInfoPolling
