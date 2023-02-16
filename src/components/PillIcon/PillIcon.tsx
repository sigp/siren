import { FC } from 'react'
import Typography from '../Typography/Typography'

export interface PillIconProps {
  text: string
}
const PillIcon: FC<PillIconProps> = ({ text }) => {
  return (
    <div className='py-1 px-3 rounded-lg bg-tertiary w-fit'>
      <Typography
        isBold
        className='text-center'
        darkMode='dark:text-white'
        color='text-white'
        type='text-tiny'
      >
        {text}
      </Typography>
    </div>
  )
}

export default PillIcon
