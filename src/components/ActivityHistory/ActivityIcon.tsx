import clsx from 'clsx'
import React, { FC } from 'react'
import getActivityIcon from '../../../utilities/getActivityIcon'
import { ActivityType } from '../../types'

export interface ActivityIconProps {
  type: ActivityType
  isError?: boolean
}

const ActivityIcon: FC<ActivityIconProps> = ({ type, isError }) => {
  const icon = getActivityIcon(type)
  const containerClasses = clsx(
    'h-12 w-12 rounded-full flex items-center justify-center',
    isError ? 'border border-error' : 'bg-gradient-to-r from-primary to-tertiary',
  )
  const iconClasses = clsx(icon, isError ? 'text-error' : 'text-white', 'text-subtitle2')

  return (
    <div className={containerClasses}>
      <i className={iconClasses} />
    </div>
  )
}

export default ActivityIcon
