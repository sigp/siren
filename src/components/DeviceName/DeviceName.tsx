import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { DEVICE_NAME_TRUNCATE } from '../../constants/constants'
import { activeDevice } from '../../recoil/atoms'
import Typography from '../Typography/Typography'

const DeviceName = () => {
  const { t } = useTranslation()
  const device = useRecoilValue(activeDevice)

  return (
    <div
      data-testid='beaconNetwork'
      className='flex flex-col h-full py-1.5 pl-2 pr-4 justify-between border-l border-r border-borderLight dark:border-borderDark'
    >
      <Typography type='text-tiny' darkMode='dark:text-white' isUpperCase isBold>
        {t('device')}
      </Typography>
      {device?.deviceName && (
        <Typography
          type='text-tiny'
          family='font-roboto'
          color='text-primary'
          darkMode='dark:text-primary'
          isUpperCase
          isBold
        >
          {device.deviceName.length < DEVICE_NAME_TRUNCATE
            ? device.deviceName
            : `${device.deviceName.substring(0, DEVICE_NAME_TRUNCATE)}...`}
        </Typography>
      )}
    </div>
  )
}

export default DeviceName
