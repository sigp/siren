import { FC, ReactElement } from 'react'
import AnimatedHeader from '../AnimatedHeader/AnimatedHeader'

export interface EarningsLayoutProps {
  children: ReactElement | ReactElement[]
  className?: string
}

const EarningsLayout: FC<EarningsLayoutProps> = ({ children, className }) => {
  return (
    <div className={`${className || ''} w-full relative overflow-hidden`}>
      <div className='w-full h-full bg-primaryBright absolute left-0 top-0 blur-3xl origin-center -rotate-45 translate-x-36 scale-125' />
      <div className='z-20 w-full h-36 absolute left-0 bottom-0 bg-gradient-to-t dark:from-dark750 from-white to-transparent' />
      <AnimatedHeader
        speed={0.1}
        name='a_earnings'
        color='#ffffff'
        className='w-full h-full absolute left-0 top-0'
      />
      {children}
    </div>
  )
}

export default EarningsLayout
