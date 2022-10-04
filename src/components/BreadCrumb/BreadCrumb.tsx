import Typography from '../Typography/Typography'
import { FC } from 'react'

export interface BreadCrumbProps {
  onClick: () => void
  previous: string
  current: string
}

const BreadCrumb: FC<BreadCrumbProps> = ({ onClick, previous, current }) => {
  return (
    <div onClick={onClick} className='cursor-pointer flex space-x-2 items-center'>
      <i className='text-caption2 bi-arrow-left' />
      <Typography type='text-caption2' className='uppercase'>
        {previous} / <span className='font-bold'>{current}</span>
      </Typography>
    </div>
  )
}

export default BreadCrumb
