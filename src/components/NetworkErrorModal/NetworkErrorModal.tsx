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
    <RodalModal isVisible={isBeaconNetworkError || isValidatorNetworkError}>
      <div className='py-12 px-4 flex flex-col items-center justify-center'>
        <i className='bi-exclamation-octagon text-error text-h3' />
        <Typography type='text-subtitle1' isBold>
          {t('networkErrorModal.title')}
        </Typography>
        <div className='max-w-xl mb-8' data-testid='networkText'>
          <Typography className='text-center mb-4'>
            <Trans
              i18nKey='networkErrorModal.affectedNetworks'
              components={{ span: <span className='font-bold text-error' /> }}
              values={{ network: effectedNetworkText() }}
            />
          </Typography>

          <div className='mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
            <div className='flex items-center justify-center mb-2'>
              <i className='bi-exclamation-triangle text-yellow-600 dark:text-yellow-400 mr-2' />
              <Typography className='text-center text-sm font-semibold text-yellow-800 dark:text-yellow-200'>
                {t('networkErrorModal.waitingForReconnection')}
              </Typography>
            </div>
            <Typography className='text-center text-sm text-yellow-700 dark:text-yellow-300'>
              <i className='bi-arrow-clockwise animate-spin mr-2' />
              {t('networkErrorModal.retryingConnection')}
            </Typography>
            <Typography className='text-center text-xs text-yellow-600 dark:text-yellow-400 mt-2'>
              {t('networkErrorModal.automaticRecovery')}
            </Typography>
          </div>

          <Typography className='text-center mt-6 text-sm text-gray-600 dark:text-gray-400'>
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
