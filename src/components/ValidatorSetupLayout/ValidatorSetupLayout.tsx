import Typography from '../Typography/Typography'
import Button, { ButtonFace } from '../Button/Button'
import { FC, ReactNode } from 'react'
import BreadCrumb from '../BreadCrumb/BreadCrumb'

export interface ValidatorSetupLayoutProps {
  children: ReactNode | ReactNode[]
  title: string
  onStepBack: () => void
  onNext: () => void
  onSecondaryAction?: () => void
  secondaryCtaText?: string
  secondaryCtaIcon?: string
  currentStep: string
  previousStep: string
  ctaText: string
  ctaIcon?: string
  mediaQuery?: string
  ctaType?: ButtonFace
}

const ValidatorSetupLayout: FC<ValidatorSetupLayoutProps> = ({
  children,
  title,
  onStepBack,
  onNext,
  currentStep,
  previousStep,
  ctaText,
  onSecondaryAction,
  secondaryCtaIcon,
  secondaryCtaText,
  ctaType = ButtonFace.PRIMARY,
  ctaIcon,
  mediaQuery = '@1200:overflow-hidden @1200:py-0 @1200:px-0 @1024:flex @1024:items-center @1024:justify-center',
}) => {
  return (
    <div className={`w-full h-full py-12 px-6 overflow-scroll ${mediaQuery}`}>
      <div className='w-full max-w-1142'>
        <BreadCrumb onClick={onStepBack} current={currentStep} previous={previousStep} />
        <Typography
          type='text-subtitle2'
          fontWeight='font-light'
          color='text-transparent'
          className='primary-gradient-text md:text-subtitle1'
        >
          {title}
        </Typography>
        <hr className='w-full h-px border-dark100 my-2' />

        {children}

        <div className='flex space-x-4'>
          <Button
            onClick={onNext}
            className='mt-4 h-8 w-32 p-0 items-center justify-center capitalize'
            type={ctaType}
          >
            {ctaText}
            {ctaIcon && <i className={`ml-3 ${ctaIcon}`} />}
          </Button>
          {secondaryCtaText && (
            <Button
              onClick={onSecondaryAction}
              className='mt-4 h-8 w-32 p-0 items-center justify-center capitalize'
              type={ButtonFace.PRIMARY}
            >
              {secondaryCtaText}
              {secondaryCtaIcon && <i className={`ml-3 ${secondaryCtaIcon}`} />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidatorSetupLayout
