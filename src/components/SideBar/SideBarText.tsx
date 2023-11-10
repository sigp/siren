import Typography from '../Typography/Typography'
import { FC } from 'react'
import addClassString from '../../utilities/addClassString'
import { OptionalBoolean } from '../../types'

export interface SideBarTextProps {
  text: string
  isActive?: boolean
  isDisabled?: OptionalBoolean
  onClick?: () => void
  className?: string
}

const SideBarText: FC<SideBarTextProps> = ({ text, isActive, onClick, isDisabled, className }) => {
  return (
    <li
      onClick={onClick}
      className={addClassString('flex items-center h-6 w-full cursor-pointer', [
        isDisabled && 'opacity-20 pointer-events-none',
        className,
      ])}
    >
      <Typography
        color={isActive ? 'text-dark900' : 'text-dark500'}
        darkMode={isActive ? 'dark:text-dark300' : 'dark:text-dark500'}
        isBold
        className='uppercase'
        type='text-tiny'
      >
        {text}
      </Typography>
    </li>
  )
}

export default SideBarText
