import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppVersion from '../AppVersion/AppVersion'
import DashboardOptions from '../DashboardOptions/DashboardOptions'
import PillIcon from '../PillIcon/PillIcon'
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
    console.log('DEBUG - NEXT_PUBLIC_COMMIT_HASH:', process.env.NEXT_PUBLIC_COMMIT_HASH)
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
              <div className='flex items-center space-x-2'>
                <PillIcon bgColor='bg-tertiary' text={`v${sirenVersion}`} />
                {process.env.NEXT_PUBLIC_COMMIT_HASH && (
                  <PillIcon bgColor='bg-gray-500' text={process.env.NEXT_PUBLIC_COMMIT_HASH} />
                )}
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
