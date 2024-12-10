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
        <div className='max-w-xl mb-8'>
          <Typography data-testid='networkText' className='text-center'>
            <Trans
              i18nKey='networkErrorModal.affectedNetworks'
              components={{ span: <span className='font-bold' /> }}
              values={{ network: effectedNetworkText() }}
            />
            <Trans i18nKey='networkErrorModal.reconfigureOrContact'>
              <a className='font-bold underline' target='_blank' rel='noreferrer' href={DiscordUrl}>
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
