import { FC } from 'react'
import MultiDeposits, { MultiDepositsProps } from './MultiDeposits'
import SingleDeposit, { SingleDepositProps } from './SingleDeposit/SingleDeposit'

export interface SignDepositProps
  extends MultiDepositsProps,
    Omit<SingleDepositProps, 'candidate'> {}

const SignDeposit: FC<SignDepositProps> = ({
  candidates,
  rewardEstimate,
  onComplete,
  sharedWithdrawalCredentials,
  sharedKeystorePassword,
  ...props
}) => {
  return candidates.length > 1 ? (
    <MultiDeposits
      sharedWithdrawalCredentials={sharedWithdrawalCredentials}
      sharedKeystorePassword={sharedKeystorePassword}
      candidates={candidates}
      {...props}
    />
  ) : (
    <SingleDeposit
      onComplete={onComplete}
      rewardEstimate={rewardEstimate}
      candidate={candidates[0]}
      {...props}
    />
  )
}

export default SignDeposit
