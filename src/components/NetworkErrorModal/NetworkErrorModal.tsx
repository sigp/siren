import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DiscordUrl } from '../../constants/constants'
import RodalModal from '../RodalModal/RodalModal'
import Typography from '../Typography/Typography'

export interface NetworkErrorModalProps {
  isBeaconNetworkError: boolean
  isValidatorNetworkError: boolean
}

const NetworkErrorModal: FC<NetworkErrorModalProps> = ({
  isBeaconNetworkError,
  isValidatorNetworkError,
}) => {
  const { t } = useTranslation()

  const effectedNetworkText = () => {
    if (isBeaconNetworkError && isValidatorNetworkError) {
      return t('networkErrorModal.beaconAndValidator')
    }

    if (isBeaconNetworkError) {
      return t('networkErrorModal.beaconNode')
    }

    return t('networkErrorModal.validatorClient')
  }

  return (
    <RodalModal
      styles={{ maxWidth: '600px' }}
      isVisible={isBeaconNetworkError || isValidatorNetworkError}
    >
      <div className='p-6'>
        <div className='pb-2 border-b mb-6 flex items-center space-x-4'>
          <i className='bi-exclamation-octagon text-error text-5xl' />
          <Typography type='text-subtitle3' isUpperCase fontWeight='font-light'>
            {t('networkErrorModal.title')}
          </Typography>
        </div>

        <div className='space-y-4'>
          <Typography type='text-caption1'>
            <Trans
              i18nKey='networkErrorModal.affectedNetworks'
              components={{ span: <span className='font-bold text-error' /> }}
              values={{ network: effectedNetworkText() }}
            />
          </Typography>

          <div className='mt-4 space-y-2'>
            <div
              className={`flex items-center p-3 rounded-lg ${isBeaconNetworkError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}
            >
              <i
                className={`${isBeaconNetworkError ? 'bi-x-circle text-red-600 dark:text-red-400' : 'bi-check-circle text-green-600 dark:text-green-400'} text-lg mr-3`}
              />
              <div className='flex-1'>
                <Typography className='font-semibold text-sm'>Beacon Node</Typography>
                <Typography className='text-xs text-gray-600 dark:text-gray-400'>
                  {isBeaconNetworkError ? 'Connection lost - retrying...' : 'Connected'}
                </Typography>
              </div>
              {isBeaconNetworkError && (
                <i className='bi-arrow-clockwise animate-spin text-red-600 dark:text-red-400' />
              )}
            </div>

            <div
              className={`flex items-center p-3 rounded-lg ${isValidatorNetworkError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}
            >
              <i
                className={`${isValidatorNetworkError ? 'bi-x-circle text-red-600 dark:text-red-400' : 'bi-check-circle text-green-600 dark:text-green-400'} text-lg mr-3`}
              />
              <div className='flex-1'>
                <Typography className='font-semibold text-sm'>Validator Client</Typography>
                <Typography className='text-xs text-gray-600 dark:text-gray-400'>
                  {isValidatorNetworkError ? 'Connection lost - retrying...' : 'Connected'}
                </Typography>
              </div>
              {isValidatorNetworkError && (
                <i className='bi-arrow-clockwise animate-spin text-red-600 dark:text-red-400' />
              )}
            </div>
          </div>

          <div className='mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <div className='flex items-center mb-2'>
              <i className='bi-exclamation-triangle text-yellow-600 dark:text-yellow-400 mr-2' />
              <Typography className='text-sm font-semibold text-yellow-800 dark:text-yellow-200'>
                {t('networkErrorModal.waitingForReconnection')}
              </Typography>
            </div>
            <Typography className='text-xs text-yellow-700 dark:text-yellow-300'>
              {t('networkErrorModal.automaticRecovery')}
            </Typography>
          </div>

          <Typography className='text-center mt-4 text-sm text-gray-600 dark:text-gray-400'>
            <Trans i18nKey='networkErrorModal.reconfigureOrContact'>
              <a
                className='font-bold underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
                target='_blank'
                rel='noreferrer'
                href={DiscordUrl}
              >
                discord
              </a>
              .
            </Trans>
          </Typography>
        </div>
      </div>
    </RodalModal>
  )
}

export default NetworkErrorModal
