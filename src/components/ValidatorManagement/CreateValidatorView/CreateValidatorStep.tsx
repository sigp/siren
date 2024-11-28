import { FC, ReactNode } from 'react'
import InvestRewards, { InvestRewardsProps } from '../../InvestRewards/InvestRewards'

export interface CreateValidatorStepProps extends InvestRewardsProps {
  children: ReactNode
}

const CreateValidatorStep: FC<CreateValidatorStepProps> = ({ children, ...props }) => {
  return (
    <div className='relative w-full h-full'>
      <div className='flex pt-8 w-full h-full'>
        <div className='flex-1 space-y-8'>{children}</div>
        <InvestRewards {...props} />
      </div>
    </div>
  )
}

export default CreateValidatorStep
