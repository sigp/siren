import Typography from '../../../components/Typography/Typography';
import AppVersion from '../../../components/AppVersion/AppVersion';
import useUiMode from '../../../hooks/useUiMode';
import { UiMode } from '../../../constants/enums';
import Toggle from '../../../components/Toggle/Toggle';
import UiModeIcon from '../../../components/UiModeIcon/UiModeIcon';
import SocialIcon from '../../../components/SocialIcon/SocialIcon';
import Input from '../../../components/Input/Input';
import { useRecoilState } from 'recoil';
import { userName } from '../../../recoil/atoms';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { UsernameStorage } from '../../../types/storage';
import {ReactComponent as LighthouseSvg} from '../../../assets/images/lighthouse-black.svg';
import { useTranslation } from 'react-i18next';
import AppDescription from '../../../components/AppDescription/AppDescription';
import { useState } from 'react';

const Settings = () => {
  const { t } = useTranslation()
  const { mode, toggleUiMode } = useUiMode()
  const [userNameError, setError] = useState<string | undefined>()
  const [username, setUsername] = useRecoilState(userName)
  const [, storeUserName] = useLocalStorage<UsernameStorage>('username', undefined)

  const handleUserNameChange = (e: any) => {
    const value = e.target.value;
    setError(undefined)

    if(!value) {
      setError(t('error.userName.required'))
    }

    if(value) {
      storeUserName(value)
    }

    setUsername(value)
  }

  return (
    <div className='relative w-full max-w-1440 px-5 py-8'>
      <LighthouseSvg className="absolute hidden top-14 right-10"/>
      <div className="relative z-10 w-full pb-20 lg:pb-0">
        <Typography type="text-subtitle1" className="capitalize" fontWeight="font-light">{t('sidebar.settings')}</Typography>
        <div className="w-full flex flex-col lg:flex-row pt-8">
          <div className="flex-1">
            <div className="w-full flex max-w-xl justify-between">
              <div>
                <Typography type="text-subtitle2" color="text-transparent" className='primary-gradient-text' fontWeight="font-light">{t('settings.currentVersion')}</Typography>
              </div>
              <div className="flex items-center space-x-2">
                <Typography type="text-caption1" isBold family="font-archivo" color="text-dark500" className="uppercase">{t('sidebar.theme')}</Typography>
                <UiModeIcon mode={mode}/>
                <Toggle id="uiModeToggle" value={mode === UiMode.DARK} onChange={toggleUiMode}/>
              </div>
            </div>
            <AppVersion className="mt-4"/>
            <Typography type="text-caption2" color="text-transparent" isBold className='primary-gradient-text uppercase mt-6' fontWeight="font-light">{t('settings.updates.nonAvailable')}</Typography>
          </div>
          <div className="flex-1 mt-8 lg:mt-0 lg:px-12">
            <AppDescription view="settings"/>
            <div className="w-full flex pt-12 justify-between">
              <SocialIcon href="https://github.com/sigp" darkMode="dark:text-primary" title="GitHub" icon="bi-github" color="text-primary"/>
              <SocialIcon href="https://github.com/sigp" darkMode="dark:text-primary" title="Discord" icon="bi-discord" color="text-primary"/>
              <SocialIcon href="https://twitter.com/sigp_io" darkMode="dark:text-primary" title="Twitter" icon="bi-twitter" color="text-primary"/>
              <SocialIcon href="https://sigmaprime.io/" darkMode="dark:text-primary" title={t('settings.links.website')} icon="bi-globe2" color="text-primary"/>
              <SocialIcon href="https://lighthouse-book.sigmaprime.io/" darkMode="dark:text-primary" title={t('settings.links.documentation')} icon="bi-life-preserver" color="text-primary"/>
            </div>
          </div>
        </div>
        <div className="w-full mt-6 lg:mt-0 px-4 md:px-0">
          <Typography color="text-transparent" className='primary-gradient-text' fontWeight="font-light">{t('settings.general')}</Typography>
          <div className="w-full flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-4 pt-8">
            <div className="flex-1">
              <Input uiMode={mode} error={userNameError} label={t('configScreen.userNameLabel')} className="capitalize max-w-xl pl-4 pt-2" onChange={handleUserNameChange} value={username}/>
            </div>
            <div className="flex-1">
              <Input uiMode={mode} label={t('configScreen.deviceName')} className="capitalize max-w-xl pl-4 pt-2" placeholder="Local Host" value={undefined}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
