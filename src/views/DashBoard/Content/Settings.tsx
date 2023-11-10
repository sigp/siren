import Typography from '../../../components/Typography/Typography'
import AppVersion from '../../../components/AppVersion/AppVersion'
import useUiMode from '../../../hooks/useUiMode'
import { AppView, OnboardView, UiMode } from '../../../constants/enums'
import Toggle from '../../../components/Toggle/Toggle'
import UiModeIcon from '../../../components/UiModeIcon/UiModeIcon'
import SocialIcon from '../../../components/SocialIcon/SocialIcon'
import Input from '../../../components/Input/Input'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { activeDevice, appView, deviceSettings, onBoardView, userName } from '../../../recoil/atoms'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { UsernameStorage } from '../../../types/storage'
import { ReactComponent as LighthouseSvg } from '../../../assets/images/lighthouse-black.svg'
import { useTranslation } from 'react-i18next'
import AppDescription from '../../../components/AppDescription/AppDescription'
import { useState } from 'react'
import Button, { ButtonFace } from '../../../components/Button/Button'
import addClassString from '../../../utilities/addClassString'
import {
  DiscordUrl,
  LighthouseBookUrl,
  SigPGithubUrl,
  SigPIoUrl,
  SigPTwitter,
} from '../../../constants/constants'
import DeviceSelect from '../../../components/DeviceSelect/DeviceSelect'
import { OptionalString } from '../../../types'

const Settings = () => {
  const { t } = useTranslation()
  const { mode, toggleUiMode } = useUiMode()
  const devices = useRecoilValue(deviceSettings)
  const currentDevice = useRecoilValue(activeDevice)
  const [userNameError, setError] = useState<OptionalString>()
  const [username, setUsername] = useRecoilState(userName)
  const setView = useSetRecoilState(onBoardView)
  const setAppView = useSetRecoilState(appView)
  const [, storeApiToken] = useLocalStorage<string>('api-token', '')
  const [, storeUserName] = useLocalStorage<UsernameStorage>('username', undefined)
  const svgClasses = addClassString('hidden md:block absolute top-14 right-10', [
    mode === UiMode.DARK ? 'opacity-20' : 'opacity-40',
  ])

  const viewConfig = () => {
    storeApiToken('')
    setView(OnboardView.CONFIGURE)
    setAppView(AppView.ONBOARD)
  }

  const handleUserNameChange = (e: any) => {
    const value = e.target.value
    setError(undefined)

    if (!value) {
      setError(t('error.userName.required'))
    }

    if (value) {
      storeUserName(value)
    }

    setUsername(value)
  }

  return (
    <div className='relative w-full max-w-1440 px-5 py-8'>
      <LighthouseSvg className={svgClasses} />
      <div className='relative z-10 w-full pb-20 lg:pb-0'>
        <div className='w-full flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 justify-between pr-12'>
          <Typography type='text-subtitle1' className='capitalize' fontWeight='font-light'>
            {t('sidebar.settings')}
          </Typography>
          <Button onClick={viewConfig} type={ButtonFace.TERTIARY}>
            <i className='bi-box-arrow-left mr-2' />
            {t('configuration')}
          </Button>
        </div>
        <div className='w-full flex flex-col lg:flex-row pt-8'>
          <div className='flex-1'>
            <div className='w-full flex flex-col md:flex-row max-w-xl justify-between'>
              <div className='order-2 md:order-1'>
                <Typography
                  type='text-subtitle2'
                  color='text-transparent'
                  className='primary-gradient-text'
                  fontWeight='font-light'
                >
                  {t('settings.currentVersion')}
                </Typography>
              </div>
              <div className='flex order-1 md:order-2 mb-8 md:mb-0 items-center space-x-2'>
                <Typography
                  type='text-caption1'
                  isBold
                  family='font-archivo'
                  color='text-dark500'
                  className='uppercase'
                >
                  {t('sidebar.theme')}
                </Typography>
                <UiModeIcon mode={mode} />
                <Toggle id='uiModeToggle' value={mode === UiMode.DARK} onChange={toggleUiMode} />
              </div>
            </div>
            <AppVersion className='mt-4' />
            <Typography
              type='text-caption2'
              color='text-transparent'
              isBold
              className='primary-gradient-text uppercase mt-6'
              fontWeight='font-light'
            >
              {t('settings.updates.nonAvailable')}
            </Typography>
          </div>
          <div className='flex-1 mt-8 lg:mt-0 lg:px-12'>
            <AppDescription view='settings' />
            <div className='w-full flex pt-12 justify-between'>
              <SocialIcon
                href={SigPGithubUrl}
                darkMode='dark:text-primary'
                title='GitHub'
                icon='bi-github'
                color='text-primary'
              />
              <SocialIcon
                href={DiscordUrl}
                darkMode='dark:text-primary'
                title='Discord'
                icon='bi-discord'
                color='text-primary'
              />
              <SocialIcon
                href={SigPTwitter}
                darkMode='dark:text-primary'
                title='Twitter'
                icon='bi-twitter'
                color='text-primary'
              />
              <SocialIcon
                href={SigPIoUrl}
                darkMode='dark:text-primary'
                title={t('settings.links.website')}
                icon='bi-globe2'
                color='text-primary'
              />
              <SocialIcon
                href={LighthouseBookUrl}
                darkMode='dark:text-primary'
                title={t('settings.links.documentation')}
                icon='bi-life-preserver'
                color='text-primary'
              />
            </div>
          </div>
        </div>
        <div className='w-full mt-6 lg:mt-0 px-0'>
          <Typography
            color='text-transparent'
            className='primary-gradient-text'
            fontWeight='font-light'
          >
            {t('settings.general')}
          </Typography>
          <div className='w-full flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-4 pt-8'>
            <div className='flex-1'>
              <Input
                uiMode={mode}
                error={userNameError}
                label={t('configScreen.userNameLabel')}
                className='capitalize max-w-xl pl-4 pt-2'
                onChange={handleUserNameChange}
                value={username}
              />
            </div>
            <div className='flex-1'>
              <DeviceSelect uiMode={mode} devices={devices} value={currentDevice.deviceName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
