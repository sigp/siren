import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import AlertIcon from '../AlertIcon/AlertIcon'
import Button, { ButtonFace } from '../Button/Button'
import { InfoBoxType } from '../InfoBox/InfoBox'
import RodalModal from '../RodalModal/RodalModal'
import Typography from '../Typography/Typography'

export interface ConfigModalProps {
  isReady: boolean
  beaconNodeVersion: string
  lighthouseVersion: string
  isBeaconError: boolean
  isValidatorError: boolean
}

const ConfigModal: FC<ConfigModalProps> = ({
  isReady,
  beaconNodeVersion,
  lighthouseVersion,
  isBeaconError,
  isValidatorError,
}) => {
  const { t } = useTranslation()

  const getAffectedServices = () => {
    if (isBeaconError && isValidatorError) {
      return 'Beacon Node and Validator Client'
    }
    if (isBeaconError) {
      return 'Beacon Node'
    }
    return 'Validator Client'
  }

  return (
    <RodalModal styles={{ maxWidth: '600px' }} isVisible={isReady}>
      <div className='p-6'>
        <div className='pb-2 border-b mb-6 flex items-center space-x-4'>
          <AlertIcon className='h-12 w-12' type={InfoBoxType.ERROR} />
          <Typography type='text-subtitle3' isUpperCase fontWeight='font-light'>
            {t('configModal.title')}
          </Typography>
        </div>
        <div className='space-y-4'>
          <Typography type='text-caption1'>
            {t('configModal.description', {
              subject: getAffectedServices(),
            })}
          </Typography>

          <div className='mt-4 space-y-2'>
            <div
              className={`flex items-center p-3 rounded-lg ${isBeaconError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}
            >
              <i
                className={`${isBeaconError ? 'bi-x-circle text-red-600 dark:text-red-400' : 'bi-check-circle text-green-600 dark:text-green-400'} text-lg mr-3`}
              />
              <div className='flex-1'>
                <Typography className='font-semibold text-sm'>Beacon Node</Typography>
                <Typography className='text-xs text-gray-600 dark:text-gray-400'>
                  {isBeaconError ? 'Connection failed - retrying...' : 'Connected'}
                </Typography>
              </div>
              {!isBeaconError && beaconNodeVersion && (
                <Typography className='text-xs text-gray-500 dark:text-gray-400'>
                  v{beaconNodeVersion}
                </Typography>
              )}
            </div>

            <div
              className={`flex items-center p-3 rounded-lg ${isValidatorError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}
            >
              <i
                className={`${isValidatorError ? 'bi-x-circle text-red-600 dark:text-red-400' : 'bi-check-circle text-green-600 dark:text-green-400'} text-lg mr-3`}
              />
              <div className='flex-1'>
                <Typography className='font-semibold text-sm'>Validator Client</Typography>
                <Typography className='text-xs text-gray-600 dark:text-gray-400'>
                  {isValidatorError ? 'Connection failed - retrying...' : 'Connected'}
                </Typography>
              </div>
              {!isValidatorError && lighthouseVersion && (
                <Typography className='text-xs text-gray-500 dark:text-gray-400'>
                  v{lighthouseVersion}
                </Typography>
              )}
            </div>
          </div>

          <div className='mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <div className='flex items-center mb-2'>
              <i className='bi-arrow-clockwise animate-spin text-yellow-600 dark:text-yellow-400 mr-2' />
              <Typography className='text-sm font-semibold text-yellow-800 dark:text-yellow-200'>
                Attempting to reconnect...
              </Typography>
            </div>
            <Typography className='text-xs text-yellow-700 dark:text-yellow-300'>
              This modal will automatically close once connections are restored.
            </Typography>
          </div>
        </div>
        <div className='w-full flex justify-end pt-8'>
          <Button type={ButtonFace.SECONDARY}>
            <div className='flex items-center'>
              <Typography color='text-white' isUpperCase type='text-caption1' family='font-roboto'>
                {t('configModal.learnMore')}
              </Typography>
              <i className='bi-box-arrow-up-right text-caption1 ml-2' />
            </div>
          </Button>
        </div>
      </div>
    </RodalModal>
  )
}

export default ConfigModal
