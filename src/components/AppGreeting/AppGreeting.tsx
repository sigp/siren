import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppVersion from '../AppVersion/AppVersion'
import DashboardOptions from '../DashboardOptions/DashboardOptions'
import Typography from '../Typography/Typography'

export interface AppGreetingProps {
  sirenVersion?: string
  bnVersion: string
  vcVersion: string
  userName: string
}

const AppGreeting: FC<AppGreetingProps> = ({ sirenVersion, userName, ...props }) => {
  const { t } = useTranslation()
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <div className='py-4 md:px-4 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between'>
      <Typography
        type='text-subtitle1'
        darkMode='dark:text-white'
        className='xl:text-h3'
        isCapitalize
        fontWeight='font-light'
      >
        {t('helloUser', { user: isReady ? userName : 'Keeper' })}
      </Typography>
      <div className='flex w-full md:w-auto justify-between md:justify-start md:space-x-16'>
        <div className='flex space-x-6'>
          <div className='space-y-1'>
            <Typography type='text-tiny' family='font-roboto' darkMode='dark:text-white' isBold>
              {t('lighthouseUiVersion')}
            </Typography>
            {sirenVersion && (
              <div className='py-1 px-3 rounded-lg w-fit bg-tertiary'>
                <Typography
                  isBold
                  className='text-center'
                  darkMode='dark:text-white'
                  color='text-white'
                  type='text-tiny'
                >
                  Siren — {sirenVersion}-{process.env.NEXT_PUBLIC_GIT_HASH || 'unknown'}
                </Typography>
              </div>
            )}
          </div>
          <div>
            <Typography type='text-tiny' family='font-roboto' darkMode='dark:text-white' isBold>
              {t('lighthouseVersion')}
            </Typography>
            <AppVersion {...props} />
          </div>
        </div>
        <DashboardOptions />
      </div>
    </div>
  )
}

export default AppGreeting
