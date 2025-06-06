import clsx from 'clsx'
import { FC } from 'react'
import Typography from '../Typography/Typography'

export interface SettingsMenuItemProps {
  text: string
  icon: string
  onClick: () => void
  isActive: boolean
}

const SettingsMenuItem: FC<SettingsMenuItemProps> = ({ text, icon, onClick, isActive }) => {
  const iconClasses = clsx('dark:text-dark300 text-caption1 text-dark900', icon)
  const containerClasses = clsx(
    'flex w-full hover:bg-dark100 dark:hover:bg-dark800 items-center p-3 space-x-3',
    isActive && 'bg-dark100 dark:bg-dark800',
  )
  return (
    <button onClick={onClick} className={containerClasses}>
      <i className={iconClasses} />
      <Typography isCapitalize type='text-caption1'>
        {text}
      </Typography>
    </button>
  )
}

export default SettingsMenuItem
