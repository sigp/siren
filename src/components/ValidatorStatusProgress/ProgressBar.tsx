import { FC } from 'react'

export interface ProgressBarProps {
  isActive: boolean
}

const ProgressBar: FC<ProgressBarProps> = ({ isActive }) => {
  return (
    <hr
      className={`h-0.5 border-none flex-1 mt-3 ${
        isActive ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-dark300'
      }`}
    />
  )
}

export default ProgressBar
