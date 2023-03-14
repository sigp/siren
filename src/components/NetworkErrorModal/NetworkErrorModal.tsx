import { AppView, OnboardView } from '../../constants/enums'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { appView, beaconNetworkError, onBoardView, validatorNetworkError } from '../../recoil/atoms'
import Typography from '../Typography/Typography'
import Button, { ButtonFace } from '../Button/Button'
import { DiscordUrl } from '../../constants/constants'
import { Trans, useTranslation } from 'react-i18next'
import RodalModal from '../RodalModal/RodalModal'

const NetworkErrorModal = () => {
  const { t } = useTranslation()
  const isBeaconNetworkError = useRecoilValue(beaconNetworkError)
  const isValidatorNetworkError = useRecoilValue(validatorNetworkError)

  const setView = useSetRecoilState(onBoardView)
  const setAppView = useSetRecoilState(appView)

  const viewConfig = () => {
    setView(OnboardView.CONFIGURE)
    setAppView(AppView.ONBOARD)
  }

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
            <Trans i18nKey='networkErrorModal.affectedNetworks'>
              <span className='font-bold' />
              {{ network: effectedNetworkText() }}
            </Trans>{' '}
            <Trans i18nKey='networkErrorModal.reconfigureOrContact'>
              <a className='font-bold underline' target='_blank' rel='noreferrer' href={DiscordUrl}>
                discord
              </a>
              .
            </Trans>
          </Typography>
        </div>
        <Button dataTestId='configure' onClick={viewConfig} type={ButtonFace.SECONDARY}>
          <i className='bi-box-arrow-left mr-2' />
          {t('configure')}
        </Button>
      </div>
    </RodalModal>
  )
}

export default NetworkErrorModal
