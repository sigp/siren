import { FC, ReactNode } from 'react'
import InvestRewards, { InvestRewardsProps } from '../../InvestRewards/InvestRewards'

export interface CreateValidatorStepProps extends InvestRewardsProps {
  children: ReactNode
}

const CreateValidatorStep: FC<CreateValidatorStepProps> = ({ children, ...props }) => {
  return (
    <div className='relative w-full lg:h-full'>
      <div className='flex flex-col lg:flex-row pt-8 w-full h-full'>
        <div className='mb-24 lg:mb-0 lg:flex-1 space-y-8'>{children}</div>
        <InvestRewards {...props} />
      </div>
    </div>
  )
}

export default CreateValidatorStep
