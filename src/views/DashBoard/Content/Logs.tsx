import Typography from '../../../components/Typography/Typography'
import LogDisplay from '../../../components/LogDisplay/LogDisplay'
import { useContext, useEffect, useMemo, useState } from 'react'
import { SSEContext } from '../../../components/SSELogProvider/SSELogProvider'
import { LogType } from '../../../types'
import SelectDropDown, { OptionType } from '../../../components/SelectDropDown/SelectDropDown'
import { LogTypeOptions } from '../../../constants/constants'

const Logs = () => {
  const [logType, selectType] = useState(LogType.VALIDATOR)
  const { beaconLogs, vcLogs } = useContext(SSEContext)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const activeLogs = useMemo(() => {
    return logType === LogType.BEACON ? beaconLogs : vcLogs
  }, [logType, beaconLogs, vcLogs])

  const toggleLogType = (selection: OptionType) => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setTimeout(() => {
        selectType(selection as LogType)
      }, 500)
    }, 500)
  }

  return (
    <div className='w-full h-full p-6 flex flex-col'>
      <div className='flex w-full justify-between'>
        <Typography fontWeight='font-light' type='text-subtitle1'>
          Lighthouse Logs
        </Typography>
        <div>
          <Typography type='text-caption1'>Service</Typography>
          <SelectDropDown value={logType} onSelect={toggleLogType} options={LogTypeOptions} />
        </div>
      </div>
      <LogDisplay isLoading={isLoading} type={logType} logs={activeLogs} />
    </div>
  )
}

export default Logs
