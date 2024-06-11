import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import AnimatedHeader, { AnimatedHeaderProps } from '../AnimatedHeader/AnimatedHeader';
import Typography from '../Typography/Typography'

export interface GradientHeaderProps extends Omit<AnimatedHeaderProps, 'className'> {
  className?: string
  title?: string
}

const GradientHeader: FC<GradientHeaderProps> = ({ className, title, isReady, name, speed }) => {
  const classes = addClassString('w-full h-36 relative overflow-hidden', [className])

  return (
    <div className={classes}>
      <AnimatedHeader speed={speed} isReady={isReady} name={name} className="w-full h-full"/>
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
