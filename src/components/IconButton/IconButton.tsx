import { ButtonHTMLAttributes, FC } from 'react'
import addClassString from '../../../utilities/addClassString'

export enum IconButtonTypes {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string
  buttonType: IconButtonTypes
  icon: string
}

const IconButton: FC<IconButtonProps> = ({ size, buttonType, icon, ...rest }) => {
  const getTypeClass = () => {
    switch (buttonType) {
      case IconButtonTypes.SECONDARY:
        return 'bg-dark600'
      case IconButtonTypes.TERTIARY:
        return 'bg-dark25 border border-dark200 dark:border-dark600 dark:bg-dark800'
      default:
        return 'bg-primary'
    }
  }

  const getIconColor = () => {
    switch (buttonType) {
      case IconButtonTypes.TERTIARY:
        return 'text-primary'
      default:
        return 'text-white'
    }
  }

  const containerClasses = addClassString(
    'hover:scale-90 transition-all duration-100 ease-in cursor-pointer rounded-full flex items-center justify-center',
    [size ? size : 'w-8 h-8', getTypeClass()],
  )

  const iconClasses = addClassString('', [icon, getIconColor()])

  return (
    <button className={containerClasses} {...rest}>
      <i className={iconClasses} />
    </button>
  )
}

export default IconButton
