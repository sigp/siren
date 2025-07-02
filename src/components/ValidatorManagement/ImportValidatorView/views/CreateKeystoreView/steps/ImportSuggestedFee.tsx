import { FC, useState } from 'react'
import CredentialInput from '../../../../../ValidatorCredentialRow/CredentialInput'
import StepOptions, { StepOptionsProps } from '../../../../CreateValidatorView/StepOptions'

export interface ImportSuggestedFeeProps extends Omit<StepOptionsProps, 'isDisabledNext'> {
  address: string | undefined
  onSetAddress: (value: string | undefined) => void
}

const ImportSuggestedFee: FC<ImportSuggestedFeeProps> = ({
  address,
  onSetAddress,
  onBackStep,
  onNextStep,
}) => {
  const [isVerified, setIsVerified] = useState(false)
  const verifyWithdrawalCredential = (value: boolean) => setIsVerified(value)

  return (
    <div className='py-8'>
      <CredentialInput
        id='suggestedFeeInput'
        value={address}
        label='Suggested Fee Recipient'
        onChange={onSetAddress}
        onVerify={verifyWithdrawalCredential}
        isVerifiedCredentials={isVerified}
      />
      <StepOptions onBackStep={onBackStep} onNextStep={onNextStep} isDisabledNext={!address} />
    </div>
  )
}

export default ImportSuggestedFee
