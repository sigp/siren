import { AnimationControls, motion, Target, VariantLabels } from 'framer-motion'
import { FC, ReactNode } from 'react'
import addClassString from '../../../utilities/addClassString'
import Typography from '../Typography/Typography'

export interface AddValidatorActionProps {
  title: string
  subTitle: string
  caption: string
  children: ReactNode
  isRecommended?: boolean
  className?: string | undefined
  animate: AnimationControls
  initial: boolean | Target | VariantLabels
  index: number
  onClick: () => void
}

const AddValidatorAction: FC<AddValidatorActionProps> = ({
  onClick,
  title,
  subTitle,
  caption,
  children,
  isRecommended,
  className,
  initial,
  animate,
  index,
}) => {
  const actionClass = addClassString('flex-1 w-full lg:max-w-80 h-[409px]', [className])
  const highlightClass = addClassString(
    'w-full h-full ease-in duration-500 transition-opacity bg-gradient-to-b dark:bg-gradient-to-b from-primary to-tertiary',
    [!isRecommended && 'opacity-0 group-hover:opacity-100'],
  )
  const containerClass = addClassString('h-full w-full flex flex-col justify-between p-4', [
    isRecommended
      ? 'bg-gradient-to-b dark:bg-gradient-to-b from-primary to-tertiary'
      : 'bg-white dark:bg-darkPrimary',
  ])
  const iconClass = addClassString('bi bi-question-circle-fill ease-in duration-500', [
    isRecommended ? 'text-white' : 'text-dark900 dark:text-dark300 group-hover:text-primary',
  ])
  const svgClass = addClassString('w-full h-full relative overflow-hidden', [
    isRecommended
      ? 'text-tertiary'
      : 'text-dark900 dark:text-dark600 group-hover:dark:text-tertiary',
  ])

  const textColor = isRecommended ? 'text-white' : undefined

  return (
    <motion.div
      onClick={onClick}
      className={actionClass}
      custom={index}
      initial={initial}
      animate={animate}
    >
      <div className='w-full h-full relative overflow-hidden ease-in transition hover:scale-[98%] cursor-pointer group bg-dark900 dark:bg-dark600'>
        <div className={highlightClass} />
        <div className='absolute z-10 left-0 top-0 w-full h-full p-0.5'>
          <div className={containerClass}>
            <div className='w-full flex justify-between'>
              <Typography
                fontWeight='font-light'
                type='text-subtitle3'
                darkMode={textColor}
                color={textColor}
              >
                {subTitle}
              </Typography>
              <i className={iconClass} />
            </div>
            <div className='h-1/2 flex flex-col justify-between'>
              <Typography
                fontWeight='font-light'
                type='text-subtitle1'
                darkMode={textColor}
                color={textColor}
                className='max-w-[200px]'
              >
                {title}
              </Typography>
              <Typography
                color={textColor || 'text-dark500'}
                darkMode={textColor || 'text-dark500'}
                type='text-sm'
              >
                {caption}
              </Typography>
            </div>
          </div>
        </div>
        <div className='w-full h-full absolute left-0 top-0 p-0.5 overflow-hidden'>
          <div className={svgClass}>{children}</div>
        </div>
      </div>
    </motion.div>
  )
}
export default AddValidatorAction
