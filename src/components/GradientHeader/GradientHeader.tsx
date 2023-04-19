import Waves from '../../assets/images/waves.png'
import { FC } from 'react'
import addClassString from '../../utilities/addClassString'
import Typography from '../Typography/Typography'

export interface GradientHeaderProps {
  className?: string
  title?: string
}

const GradientHeader: FC<GradientHeaderProps> = ({ className, title }) => {
  const classes = addClassString('w-full h-36 relative', [className])

  return (
    <div className={classes}>
      <div
        className='w-full h-full bg-no-repeat bg-right opacity-10'
        style={{ backgroundImage: `url(${Waves})` }}
      />
      <div className='absolute top-0 left-0 w-3/4 h-full bg-gradient-to-r from-white dark:from-dark750 via-white dark:via-dark750 to-transparent' />
      {title && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center p-5 z-20'>
          <Typography
            type='text-subtitle1'
            color='text-transparent'
            darkMode='text-transparent'
            className='primary-gradient-text capitalize'
            fontWeight='font-light'
          >
            {title}
          </Typography>
        </div>
      )}
    </div>
  )
}

export default GradientHeader
