import useTrackLogs, { defaultLogData, trackedLogData } from '../../hooks/useTrackLogs'
import { FC, ReactElement, createContext, useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { selectBeaconUrl } from '../../recoil/selectors/selectBeaconUrl'
import { selectValidatorUrl } from '../../recoil/selectors/selectValidatorUrl'

export interface SSELogWrapperProps {
  trigger?: number
  children: ReactElement | ReactElement[]
}

export const SSEContext = createContext<{ beaconLogs: trackedLogData; vcLogs: trackedLogData }>({
  beaconLogs: defaultLogData,
  vcLogs: defaultLogData,
})

const SSELogProvider: FC<SSELogWrapperProps> = ({ children, trigger = 10000 }) => {
  const [, setTrigger] = useState(false)
  const beaconUrl = useRecoilValue(selectBeaconUrl)
  const validatorUrl = useRecoilValue(selectValidatorUrl)
  const beaconLogs = useTrackLogs(beaconUrl ? `${beaconUrl}/lighthouse/logs` : undefined)
  const validatorLogs = useTrackLogs(beaconUrl ? `${validatorUrl}/logs` : undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger((prevTrigger) => !prevTrigger)
      beaconLogs.cleanLogs()
      validatorLogs.cleanLogs()
    }, trigger)

    return () => {
      clearInterval(interval)
    }
  }, [beaconLogs.cleanLogs, validatorLogs.cleanLogs])

  return (
    <SSEContext.Provider value={{ beaconLogs: beaconLogs, vcLogs: validatorLogs }}>
      {children}
    </SSEContext.Provider>
  )
}

export default SSELogProvider
