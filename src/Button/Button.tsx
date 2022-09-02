import React, {FC, ReactNode} from "react";
import {TypographyFamily} from "../Typography/Typography";

export enum ButtonFace {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  TERTIARY = "TERTIARY"
}

export interface ButtonProps {
  type?: ButtonFace
  isDisabled?: boolean
  font?: TypographyFamily
  children: ReactNode | ReactNode[]
  onClick?: () => void,
  href?: string,
  target?: '_self' | '_blank'
}

const Button:FC<ButtonProps> = ({type = ButtonFace.PRIMARY, children, onClick, href, target = '_self', font = 'font-openSauce', isDisabled}) => {
  const formatFaceStyle = () => {
    switch (type) {
      case ButtonFace.TERTIARY:
        return 'border border-primary text-primary';
      case ButtonFace.SECONDARY:
        return 'bg-primary text-white'
      default:
        return 'border border-black text-black disabled:border-dark300 disabled:text-dark300 disabled:pointer-events-none'
    }
  }

  const renderButton = () => (
      <button onClick={onClick} disabled={isDisabled} className={`${formatFaceStyle()} ${font} box-border px-4 py-2 w-fit cursor-pointer flex space-x-2`}>
        {children}
      </button>
  )
  return href ? (
      <a href={href} target={target}>{renderButton()}</a>
  ) : renderButton()
}

export default Button;