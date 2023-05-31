import Typography from '../../../components/Typography/Typography'
import LogDisplay from '../../../components/LogDisplay/LogDisplay'
import { useContext, useEffect, useMemo, useState } from 'react'
import { SSEContext } from '../../../components/SSELogProvider/SSELogProvider'
import { LogType } from '../../../types'
import SelectDropDown, { OptionType } from '../../../components/SelectDropDown/SelectDropDown'
import { LogTypeOptions } from '../../../constants/constants'
import Toggle from '../../../components/Toggle/Toggle'
import Button, { ButtonFace } from '../../../components/Button/Button'
import { useTranslation } from 'react-i18next'

const Logs = () => {
  const { t } = useTranslation()
  const [logType, selectType] = useState(LogType.VALIDATOR)
  const {
    beaconLogs,
    vcLogs,
    intervalId,
    clearRefreshInterval,
    startRefreshInterval,
    triggerRefresh,
  } = useContext(SSEContext)
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
    if (selection === logType) return

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setTimeout(() => {
        selectType(selection as LogType)
      }, 500)
    }, 500)
  }

  const toggleTriggerInterval = (value: boolean) => {
    if (!value) {
      clearRefreshInterval()
      return
    }

    startRefreshInterval()
  }

  const manualRefresh = () => {
    setLoading(true)
    triggerRefresh()
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  return (
    <div className='w-full h-full pt-8 p-2 md:p-6 flex flex-col'>
      <div className='flex flex-col w-full space-y-4 lg:space-y-0 lg:flex-row lg:space-x-20'>
        <Typography fontWeight='font-light' type='text-subtitle1'>
          {t('logs.title')}
        </Typography>
        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-20'>
          <div>
            <Typography
              type='text-caption2'
              color='text-dark500'
              darkMode='dark:text-dark500'
              isUpperCase
            >
              {t('logs.service')}
            </Typography>
            <SelectDropDown value={logType} onSelect={toggleLogType} options={LogTypeOptions} />
          </div>
          <div className='flex space-x-2'>
            <div className='flex items-center space-x-3'>
              <Typography
                type='text-caption2'
                color='text-dark500'
                darkMode='dark:text-dark500'
                family='font-archivo'
                isUpperCase
              >
                {t('logs.autoRefresh')}
              </Typography>
              <Toggle
                id='triggerIntervalToggle'
                value={Boolean(intervalId)}
                onChange={toggleTriggerInterval}
              />
            </div>
            <Button type={ButtonFace.ICON} isDisabled={Boolean(intervalId)} onClick={manualRefresh}>
              <i className='bi-arrow-clockwise text-3xl' />
            </Button>
          </div>
        </div>
      </div>
      <LogDisplay isLoading={isLoading} type={logType} logs={activeLogs} />
    </div>
  )
}

export default Logs
