import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import Typography from '../Typography/Typography'

export interface PillIconProps {
  text: string
  bgColor: string
  bgDark?: string
}
const PillIcon: FC<PillIconProps> = ({ text, bgColor, bgDark }) => {
  const classes = addClassString('py-1 px-3 rounded-lg w-fit', [bgColor, bgDark])
  return (
    <div className={classes}>
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
