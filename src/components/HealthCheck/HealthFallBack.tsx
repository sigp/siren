import { FC } from 'react'
import Spinner from '../Spinner/Spinner'

export interface HealthFallBackProps {
  size?: 'sm' | 'lg'
}

const HealthFallBack: FC<HealthFallBackProps> = ({ size = 'sm' }) => {
  return (
    <div
      className={`w-full border mb-2 border-dark200 ${
        size === 'lg' ? 'md:h-64' : 'md:h-24'
      } flex flex-col items-center justify-center space-y-3 md:space-y-0 md:flex-row md:space-x-2`}
    >
      <Spinner />
    </div>
  )
}

export default HealthFallBack
