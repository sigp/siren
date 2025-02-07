import { motion } from 'framer-motion'
import Carousel from 'nuka-carousel'
import React, {
  FC,
  ReactElement,
  useState,
  useCallback,
  useMemo,
  Fragment,
  Children,
  isValidElement,
} from 'react'
import ProgressBar from '../ProgressBar/ProgressBar'
import Typography from '../Typography/Typography'

export interface StepperRenderProps {
  incrementStep: () => void
  decrementStep: () => void
  step: number
}

export interface HorizontalStepperProps {
  children: (props: StepperRenderProps) => ReactElement | ReactElement[]
  steps: string[]
}

const HorizontalStepper: FC<HorizontalStepperProps> = ({ children, steps }) => {
  const totalSteps = steps.length
  const [currentStep, setCurrentStep] = useState(0)

  const incrementStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const decrementStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const stepperProps = useMemo(
    () => ({
      incrementStep,
      decrementStep,
      step: currentStep,
    }),
    [incrementStep, decrementStep, currentStep],
  )

  const slides = useMemo(() => {
    return Children.toArray(children(stepperProps)).flatMap((child) => {
      if (isValidElement(child) && child.type === Fragment) {
        return Children.toArray(child.props.children)
      }
      return child
    })
  }, [children, stepperProps])

  return (
    <>
      <div className='w-full'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full flex'>
          {steps.map((label, index) => (
            <div
              key={index}
              className='flex-1 h-11 bg-dark25 dark:bg-dark750 flex items-center justify-center border-r dark:border-r-dark600 last:border-r-0'
            >
              <div className='flex space-x-2 items-center'>
                <div className='w-6 h-6 lg:w-3 lg:h-3 flex items-center justify-center border dark:border-dark300 text-dark900 rounded-full'>
                  <Typography type='text-caption' className='lg:text-xTiny'>
                    {index + 1}
                  </Typography>
                </div>
                <Typography className='hidden lg:block' type='text-caption1'>
                  {label}
                </Typography>
              </div>
            </div>
          ))}
        </motion.div>
        <ProgressBar total={totalSteps} position={currentStep + 1} />
      </div>
      <div className='w-full h-full relative createSlide'>
        <Carousel swiping={false} slideIndex={currentStep} dragging={false} withoutControls>
          {slides.map((child, index) => (
            <div key={index} className='h-full w-full'>
              {child}
            </div>
          ))}
        </Carousel>
      </div>
    </>
  )
}

export default HorizontalStepper
