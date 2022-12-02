import { FC } from 'react'

export interface ProgressIconProps {
  isActive: boolean
  className?: string
}

const ProgressIcon: FC<ProgressIconProps> = ({ isActive, className }) => {
  const defaultIconStyle = 'bi-circle text-gray-300'
  const gradientIconStyle = 'text-transparent primary-gradient-text bi-check-circle'

  return <i className={`${className} ${isActive ? gradientIconStyle : defaultIconStyle}`} />
}

export default ProgressIcon
