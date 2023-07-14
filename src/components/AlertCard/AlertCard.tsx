import StatusBar, { StatusBarProps } from '../StatusBar/StatusBar'
import Typography from '../Typography/Typography'
import { FC } from 'react'

export interface AlertCardProps extends StatusBarProps {
  text: string
  subText: string
  onClick?: () => void
}

const AlertCard: FC<AlertCardProps> = ({ text, subText, onClick, ...props }) => {
  return (
    <div className='w-full h-14 group border-b-style500 flex justify-between items-center space-x-2 p-2'>
      <StatusBar {...props} />
      <div className='w-full max-w-tiny'>
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
