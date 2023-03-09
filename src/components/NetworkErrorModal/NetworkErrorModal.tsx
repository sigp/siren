import Rodal from 'rodal'
import { AppView, OnboardView, UiMode } from '../../constants/enums'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { appView, beaconNetworkError, onBoardView, validatorNetworkError } from '../../recoil/atoms'
import useUiMode from '../../hooks/useUiMode'
import useMediaQuery from '../../hooks/useMediaQuery'
import Typography from '../Typography/Typography'
import Button, { ButtonFace } from '../Button/Button'
import { DiscordUrl } from '../../constants/constants'
import { Trans, useTranslation } from 'react-i18next'

const NetworkErrorModal = () => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const isBeaconNetworkError = useRecoilValue(beaconNetworkError)
  const isValidatorNetworkError = useRecoilValue(validatorNetworkError)

  const isTablet = useMediaQuery('(max-width: 1024px)')

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
    <Rodal
      visible={isBeaconNetworkError || isValidatorNetworkError}
      showCloseButton={false}
      customStyles={{
        backgroundColor: mode === UiMode.DARK ? '#1E1E1E' : 'white',
        width: '100%',
        maxWidth: isTablet ? '448px' : '649px',
        height: 'max-content',
        overflow: 'scroll',
        zIndex: 999,
      }}
    >
      <div className='py-12 px-4 flex flex-col items-center justify-center'>
        <i className='bi-exclamation-octagon text-error text-h3' />
        <Typography type='text-subtitle1' isBold>
          {t('networkErrorModal.title')}
        </Typography>
        <div className='max-w-xl mb-8'>
          <Typography className='text-center'>
            <Trans i18nKey='networkErrorModal.affectedNetworks'>
              <span className='font-bold' />
              {{ network: effectedNetworkText() }}
            </Trans>
          </Typography>
          <Typography className='text-center'>
            <Trans i18nKey='networkErrorModal.reconfigureOrContact'>
              <a className='font-bold underline' target='_blank' rel='noreferrer' href={DiscordUrl}>
                discord
              </a>
              .
            </Trans>
          </Typography>
        </div>
        <Button onClick={viewConfig} type={ButtonFace.SECONDARY}>
          <i className='bi-box-arrow-left mr-2' />
          {t('configure')}
        </Button>
      </div>
    </Rodal>
  )
}

export default NetworkErrorModal
