import React, { FC, ReactNode } from 'react'
import { TypographyFamily, TypographyType } from '../Typography/Typography'
import Spinner from '../Spinner/Spinner'
import addClassString from '../../utilities/addClassString'

export enum ButtonFace {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
  ICON = 'ICON',
  LIGHT = 'LIGHT',
  LIGHT_ACTIVE = 'LIGHT_ACTIVE',
  WHITE = 'WHITE',
}

export interface ButtonProps {
  type?: ButtonFace
  isDisabled?: boolean
  font?: TypographyFamily
  fontType?: TypographyType
  children: ReactNode | ReactNode[]
  onClick?: () => void
  dataTestId?: string
  padding?: string
  className?: string
  renderAs?: 'submit' | 'reset' | 'button'
  href?: string
  target?: '_self' | '_blank'
  isLoading?: boolean
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
}) => {
  const buttonContentClasses = addClassString('flex space-x-2', [isLoading && 'opacity-0'])
  const spinnerContentClasses = addClassString('', [
    !isLoading && 'hidden',
    isLoading && 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  ])

  const formatFaceStyle = () => {
    switch (type) {
      case ButtonFace.LIGHT_ACTIVE:
        return 'bg-primary80 text-primary'
      case ButtonFace.LIGHT:
        return 'bg-primary100 text-primary'
      case ButtonFace.ICON:
        return 'h-full w-11 dark:bg-dark900 text-dark300 dark:text-white'
      case ButtonFace.TERTIARY:
        return 'border border-primary text-primary'
      case ButtonFace.SECONDARY:
        return 'bg-primary text-white disabled:cursor-default disabled:opacity-30'
      case ButtonFace.WHITE:
        return 'bg-transparent disabled:border-dark300 disabled:text-dark300 disabled:cursor-default border border-white text-white'
      default:
        return 'border border-black text-black disabled:border-dark300 disabled:text-dark300 disabled:pointer-events-none'
    }
  }

  const renderButton = () => (
    <button
      data-testid={dataTestId}
      type={renderAs}
      onClick={onClick}
      disabled={isDisabled}
      className={`${formatFaceStyle()} ${font} ${fontType} ${className} ${
        isLoading && 'pointer-events-none'
      } relative box-border ${padding} w-fit cursor-pointer flex space-x-2`}
    >
      <div className={buttonContentClasses}>{children}</div>
      {isLoading && <Spinner className={spinnerContentClasses} size='h-6 w-6' />}
    </button>
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
