import React, { FC } from 'react'
import formatNodeVersion from '../../../utilities/formatNodeVersion'
import DashboardOptions from '../DashboardOptions/DashboardOptions'
import Typography from '../Typography/Typography'

export interface AppGreetingProps {
  sirenVersion?: string
  bnVersion: string
  vcVersion: string
}

const AppGreeting: FC<AppGreetingProps> = ({ sirenVersion, bnVersion, vcVersion }) => {
  const beaconVersion = formatNodeVersion(bnVersion)
  const validatorVersion = formatNodeVersion(vcVersion)

  return (
    <div className='py-3 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
      {/* Horizontal Version Layout */}
      <div className='flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6 @1600:gap-10'>
        {/* Siren */}
        <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2'>
          <Typography type='text-tiny' isBold darkMode='dark:text-white' isUpperCase>
            Siren:
          </Typography>
          {sirenVersion && (
            <div className='py-1.5 px-4 rounded-lg bg-tertiary'>
              <Typography
                isBold
                darkMode='dark:text-white'
                color='text-white'
                type='text-tiny'
                family='font-roboto'
              >
                v{sirenVersion}-{process.env.NEXT_PUBLIC_GIT_HASH || 'unknown'}
              </Typography>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className='hidden md:block w-px h-8 bg-dark200 dark:bg-dark600' />

        {/* Beacon Node */}
        <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2'>
          <Typography type='text-tiny' isBold darkMode='dark:text-white' isUpperCase>
            Beacon Node:
          </Typography>
          <div className='py-1.5 px-4 rounded-lg bg-dark100 dark:bg-dark750 border border-dark200 dark:border-dark600'>
            <Typography
              type='text-tiny'
              family='font-roboto'
              color='text-primary'
              darkMode='dark:text-primary'
              isBold
              className='uppercase'
            >
              {beaconVersion?.version || 'Lighthouse'}
              {beaconVersion?.id && `-${beaconVersion.id}`}
            </Typography>
          </div>
        </div>

        {/* Divider */}
        <div className='hidden md:block w-px h-8 bg-dark200 dark:bg-dark600' />

        {/* Validator Client */}
        <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2'>
          <Typography type='text-tiny' isBold darkMode='dark:text-white' isUpperCase>
            Validator Client:
          </Typography>
          <div className='py-1.5 px-4 rounded-lg bg-dark100 dark:bg-dark750 border border-dark200 dark:border-dark600'>
            <Typography
              type='text-tiny'
              family='font-roboto'
              color='text-primary'
              darkMode='dark:text-primary'
              isBold
              className='uppercase'
            >
              {validatorVersion?.version || 'Lighthouse'}
              {validatorVersion?.id && `-${validatorVersion.id}`}
            </Typography>
          </div>
        </div>
      </div>

      {/* Dashboard Options */}
      <DashboardOptions />
    </div>
  )
}

export default AppGreeting
