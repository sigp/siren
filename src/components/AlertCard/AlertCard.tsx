import { FC } from 'react'
import StatusBar, { StatusBarProps } from '../StatusBar/StatusBar'
import Typography from '../Typography/Typography'

export interface AlertCardProps extends StatusBarProps {
  text: string
  subText: string
  onClick?: () => void
}

const AlertCard: FC<AlertCardProps> = ({ text, subText, onClick, ...props }) => {
  return (
    <div className='w-full @1540:h-22 group border-b-style500 flex justify-between items-center space-x-2 @1540:space-x-4 p-2'>
      <StatusBar {...props} />
      <div className='w-full max-w-tiny @1540:max-w-full'>
        <Typography type='text-caption2'>{text}</Typography>
        <Typography type='text-caption2' isUpperCase>
          {subText}
        </Typography>
      </div>
      <i
        onClick={onClick}
        className='bi-trash-fill cursor-pointer opacity-0 group-hover:opacity-100 text-dark200 dark:text-dark300'
      />
    </div>
  )
}

export default AlertCard
