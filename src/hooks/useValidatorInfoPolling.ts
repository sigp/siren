import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import usePollingInterval from './usePollingInterval'
import { secondsInSlot } from '../constants/constants'
import { fetchValidatorStatuses } from '../api/beacon'
import { useEffect, useState } from 'react'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { selectValidators } from '../recoil/selectors/selectValidators'
import { validatorInfoInterval, validatorStateInfo } from '../recoil/atoms'
import { Validator } from '../types/validator'

const useValidatorInfoPolling = () => {
  const baseBeaconUrl = useRecoilValue(selectBeaconUrl)
  const [isReady, setReady] = useState(false)
  const { contents: validators, state } = useRecoilValueLoadable(selectValidators)
  const setStateInfo = useSetRecoilState(validatorStateInfo)
  const [validatorInterval, setInterval] = useRecoilState(validatorInfoInterval)
  const isSkip = Boolean(validatorInterval) && isReady

  useEffect(() => {
    setReady(true)
  }, [])

  const fetchValidatorInfo = async () => {
    if (!baseBeaconUrl || !validators) return

    const beaconValidators = await fetchValidatorStatuses(
      baseBeaconUrl,
      validators.map((validator: Validator) => validator.pubKey).join(','),
    )

    setStateInfo(beaconValidators.data.data)
  }
  const onClearInterval = () => setInterval(undefined)

  useEffect(() => {
    if (state === 'hasValue' && isReady) {
      void fetchValidatorInfo()
    }
  }, [state, isReady])

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
