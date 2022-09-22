import Typography from '../Typography/Typography'
import { FC } from 'react'

export interface SideBarTextProps {
  text: string
  isActive?: boolean
  onClick?: () => void
}

const SideBarText: FC<SideBarTextProps> = ({ text, isActive, onClick }) => {
  return (
    <li onClick={onClick} className='flex items-center h-6 w-full cursor-pointer'>
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
