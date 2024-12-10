import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'
import Typography from '../Typography/Typography'

export interface VerticalStepperProps {
  children: ReactNode[]
  titles: string[]
  step: number
}

const VerticalStepper: FC<VerticalStepperProps> = ({ children, titles, step }) => {
  return (
    <div className='w-full border-style rounded px-8 pb-8'>
      {children.map((child, index) => {
        return (
          <div key={index}>
            <div className='border-b-style py-4'>
              <Typography
                color={step === index ? 'text-dark900' : 'text-dark300'}
                isBold
              >{`${index + 1}. ${titles[index]}`}</Typography>
            </div>
            <motion.div
              className='overflow-hidden'
              key={index}
              initial={{ height: 0 }}
              animate={{
                height: step === index ? 'auto' : 0,
              }}
              transition={{ duration: step === index ? 0.4 : 0 }}
            >
              {child}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

export default VerticalStepper
