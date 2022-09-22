import Typography from '../Typography/Typography'
import { FC } from 'react'

export interface TabOptionProps {
  toolTip?: string
  isActive?: boolean
  text: string
  onClick?: () => void
}

const TabOption: FC<TabOptionProps> = ({ text, toolTip, isActive, onClick }) => {
  return (
    <div onClick={onClick} className='space-y-3 cursor-pointer group'>
      <div className='flex items-center space-x-2'>
        <Typography
          family='font-archivo'
          color={isActive ? 'text-white' : 'text-dark200'}
          type='text-caption2'
          className='md:text-caption1 group-hover:text-white uppercase'
        >
          {text}
        </Typography>
        {toolTip && (
          <i className='bi-question-circle-fill text-caption2 md:text-caption1 text-white' />
        )}
      </div>
      {isActive && <hr className='bg-white w-full h-0.5' />}
    </div>
  )
}

export default TabOption
