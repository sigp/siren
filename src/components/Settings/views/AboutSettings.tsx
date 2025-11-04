import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../utilities/addClassString'
import LighthouseSvg from '../../../assets/images/lighthouse-black.svg'
import {
  DiscordUrl,
  LighthouseBookUrl,
  SigPGithubUrl,
  SigPIoUrl,
  SigPTwitter,
} from '../../../constants/constants'
import { UiMode } from '../../../constants/enums'
import useUiMode from '../../../hooks/useUiMode'
import AppDescription from '../../AppDescription/AppDescription'
import AppVersion from '../../AppVersion/AppVersion'
import SocialIcon from '../../SocialIcon/SocialIcon'
import Typography from '../../Typography/Typography'
import SettingsHeader from '../SettingsHeader'

export interface AboutSettingsProps {
  bnVersion: string
  vcVersion: string
  sirenVersion?: string
}

const AboutSettings: FC<AboutSettingsProps> = ({ bnVersion, vcVersion, sirenVersion }) => {
  const { t } = useTranslation()
  const { mode } = useUiMode()

  const svgClasses = addClassString('hidden md:block fixed top-48 -right-24', [
    mode === UiMode.DARK ? 'opacity-20' : 'opacity-40',
  ])

  return (
    <div className='flex-1 min-h-full w-full max-w-[1540px] relative p-12'>
      <LighthouseSvg className={svgClasses} />
      <div className='relative z-10 w-full pb-20 lg:pb-0'>
        <SettingsHeader sections={[t('settings'), t('about')]} />
        <div className='w-full flex flex-col lg:flex-row pt-8'>
          <div className='flex-1'>
            <div className='w-full flex flex-col md:flex-row max-w-xl justify-between'>
              <div className='order-2 md:order-1'>
                <Typography
                  type='text-subtitle3'
                  color='text-transparent'
                  className='primary-gradient-text'
                  fontWeight='font-light'
                >
                  {t('currentVersion')}
                </Typography>
              </div>
            </div>
            <div className='mt-6 space-y-4'>
              {/* Siren Version */}
              {sirenVersion && (
                <div>
                  <Typography
                    type='text-caption1'
                    isBold
                    darkMode='dark:text-white'
                    className='mb-2'
                  >
                    Siren
                  </Typography>
                  <div className='py-2 px-4 rounded-lg bg-tertiary w-fit'>
                    <Typography
                      type='text-caption1'
                      isBold
                      darkMode='dark:text-white'
                      color='text-white'
                      family='font-roboto'
                    >
                      v{sirenVersion}-{process.env.NEXT_PUBLIC_GIT_HASH || 'unknown'}
                    </Typography>
                  </div>
                </div>
              )}
              {/* Lighthouse Versions */}
              <div>
                <Typography type='text-caption1' isBold darkMode='dark:text-white' className='mb-2'>
                  Lighthouse
                </Typography>
                <AppVersion bnVersion={bnVersion} vcVersion={vcVersion} />
              </div>
            </div>
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
                title={t('website')}
                icon='bi-globe2'
                color='text-primary'
              />
              <SocialIcon
                href={LighthouseBookUrl}
                darkMode='dark:text-primary'
                title={t('documentation')}
                icon='bi-life-preserver'
                color='text-primary'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutSettings
