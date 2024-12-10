import { motion, MotionProps } from 'framer-motion'
import React, { FC, ReactNode } from 'react'
import addClassString from '../../../utilities/addClassString'
import { OptionalBoolean } from '../../types'
import Spinner from '../Spinner/Spinner'
import { TypographyFamily, TypographyType } from '../Typography/Typography'

export enum ButtonFace {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  ERROR = 'ERROR',
  TERTIARY = 'TERTIARY',
  ICON = 'ICON',
  LIGHT = 'LIGHT',
  LIGHT_ACTIVE = 'LIGHT_ACTIVE',
  WHITE = 'WHITE',
}

export interface ButtonProps extends MotionProps {
  type?: ButtonFace | undefined
  isDisabled?: OptionalBoolean
  font?: TypographyFamily
  fontType?: TypographyType
  children: ReactNode | ReactNode[]
  onClick?: (() => void) | undefined
  dataTestId?: string
  padding?: string
  className?: string
  renderAs?: 'submit' | 'reset' | 'button'
  href?: string
  target?: '_self' | '_blank' | undefined
  isLoading?: OptionalBoolean
}

const Button: FC<ButtonProps> = ({
  type = ButtonFace.PRIMARY,
  children,
  onClick,
  href,
  className,
  fontType = 'text-body',
  target = '_self',
  dataTestId,
  font = 'font-openSauce',
  isDisabled,
  padding = 'px-4 py-2',
  renderAs = 'button',
  isLoading,
  initial,
  animate,
  transition,
}) => {
  const buttonContentClasses = addClassString('flex space-x-2', [isLoading && 'opacity-0'])
  const spinnerContentClasses = addClassString('', [
    !isLoading && 'hidden',
    isLoading && 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  ])

  const formatFaceStyle = () => {
    switch (type) {
      case ButtonFace.LIGHT_ACTIVE:
        return 'bg-primary80 text-primaryOverride'
      case ButtonFace.LIGHT:
        return 'bg-primary100 text-primaryOverride'
      case ButtonFace.ICON:
        return 'h-full w-11 text-dark300 dark:text-white'
      case ButtonFace.TERTIARY:
        return 'border border-primary text-primary hover:opacity-80'
      case ButtonFace.SECONDARY:
        return 'bg-primary text-white'
      case ButtonFace.WHITE:
        return 'bg-transparent disabled:border-dark300 disabled:text-dark300 disabled:cursor-default border border-white text-white'
      case ButtonFace.ERROR:
        return 'border border-error text-error hover:opacity-80'
      default:
        return 'border border-black text-black disabled:border-dark300 disabled:text-dark300 disabled:pointer-events-none'
    }
  }

  const renderButton = () => (
    <motion.button
      initial={initial}
      animate={animate}
      transition={transition}
      data-testid={dataTestId}
      type={renderAs}
      onClick={onClick}
      disabled={isDisabled}
      className={`${formatFaceStyle()} ${font} ${fontType} ${className} ${
        isLoading && 'pointer-events-none'
      } relative box-border ${padding} active:scale-95 transition-all duration-100 ease-in w-fit cursor-pointer disabled:cursor-default disabled:pointer-events-none disabled:opacity-30 flex justify-center space-x-2`}
    >
      <div className={buttonContentClasses}>{children}</div>
      {isLoading && <Spinner className={spinnerContentClasses} size='h-6 w-6' />}
    </motion.button>
  )
  return href ? (
    <a href={href} target={target}>
      {renderButton()}
    </a>
  ) : (
    renderButton()
  )
}

export default Button
