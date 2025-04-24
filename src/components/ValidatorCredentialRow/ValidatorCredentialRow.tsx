import { FC, memo } from 'react'
import { ValidatorCandidate } from '../../types'
import ValidatorCandidateRow from '../ValidatorCandidateRow/ValidatorCandidateRow'
import CredentialInput from './CredentialInput'

export interface ValidatorCredentialRowProps {
  validatorCandidate: ValidatorCandidate
  onUpdateCandidate: (id: string, candidate: ValidatorCandidate) => void
  isAdvanceView: boolean
}

const ValidatorCredentialRow: FC<ValidatorCredentialRowProps> = ({
  validatorCandidate,
  onUpdateCandidate,
  isAdvanceView,
}) => {
  const {
    id,
    index,
    isVerifiedCredentials,
    isVerifiedSuggestedFee,
    withdrawalCredentials,
    suggestedFeeRecipient,
  } = validatorCandidate
  const setCredential = (value: string | undefined) => {
    onUpdateCandidate(
      id,
      isAdvanceView
        ? { ...validatorCandidate, withdrawalCredentials: value, isVerifiedCredentials: false } // if advanced view only set withdrawal
        : {
            ...validatorCandidate,
            withdrawalCredentials: value,
            suggestedFeeRecipient: value,
            isVerifiedCredentials: false,
            isVerifiedSuggestedFee: false,
          }, // if basic view set both withdrawal and suggested fee to same value
    )
  }

  const verifyWithdrawalCredential = (value: boolean) => {
    onUpdateCandidate(
      id,
      isAdvanceView
        ? { ...validatorCandidate, isVerifiedCredentials: value } // if advanced view set only withdrawal
        : { ...validatorCandidate, isVerifiedCredentials: value, isVerifiedSuggestedFee: value }, // if basic view set both withdrawal and suggested fee to same value
    )
  }

  const setSuggestedFee = (value: string | undefined) => {
    onUpdateCandidate(id, {
      ...validatorCandidate,
      suggestedFeeRecipient: value,
      isVerifiedSuggestedFee: false,
    })
  }

  const verifySuggestedFee = (value: boolean) => {
    onUpdateCandidate(id, { ...validatorCandidate, isVerifiedSuggestedFee: value })
  }

  return (
    <ValidatorCandidateRow data={validatorCandidate} index={index ? Number(index) : undefined}>
      <div className='w-full px-2 py-4 space-y-4 max-w-[500px]'>
        <CredentialInput
          id={`withdrawalCredentialInput-${index}`}
          value={withdrawalCredentials}
          label={isAdvanceView ? 'Withdrawal Credentials' : undefined}
          onChange={setCredential}
          onVerify={verifyWithdrawalCredential}
          isVerifiedCredentials={Boolean(isVerifiedCredentials)}
        />
        {isAdvanceView && (
          <CredentialInput
            id={`suggestedFeeInput-${index}`}
            value={suggestedFeeRecipient}
            label={isAdvanceView ? 'Suggested Fee Recipient' : undefined}
            onChange={setSuggestedFee}
            onVerify={verifySuggestedFee}
            isVerifiedCredentials={Boolean(isVerifiedSuggestedFee)}
          />
        )}
      </div>
    </ValidatorCandidateRow>
  )
}

export default memo(ValidatorCredentialRow)
