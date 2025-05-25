import clsx from 'clsx'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WithdrawalCredentialView } from '../../../../constants/enums'
import { useMaxHeight } from '../../../../hooks/useMaxHeight'
import { ValidatorCandidate } from '../../../../types'
import CheckBox from '../../../CheckBox/CheckBox'
import InfoBox, { InfoBoxType } from '../../../InfoBox/InfoBox'
import Typography from '../../../Typography/Typography'
import ValidatorCredentialRow from '../../../ValidatorCredentialRow/ValidatorCredentialRow'
import StepOptions from '../StepOptions'

export interface WithdrawalCredentialsProps {
  onNextStep: () => void
  onBackStep: () => void
  candidates: ValidatorCandidate[]
  onValidatorChange: (vals: ValidatorCandidate[]) => void
  isActive: boolean
  hasAcceptedRisk: boolean
  onShowRisk: () => void
  sharedCredentials: string | undefined
  sharedSuggestedFeeRecipient: string | undefined
  onUpdateSharedCredentials: (credentials?: string) => void
  onUpdateSharedSuggestedFee: (suggestedFee?: string) => void
}

const WithdrawalCredentials: FC<WithdrawalCredentialsProps> = ({
  onNextStep,
  onBackStep,
  candidates,
  onValidatorChange,
  isActive,
  onShowRisk,
  hasAcceptedRisk,
  sharedCredentials,
  sharedSuggestedFeeRecipient,
  onUpdateSharedCredentials,
  onUpdateSharedSuggestedFee,
}) => {
  const { t } = useTranslation()
  const valCount = candidates.length
  const [isAll, setIsAll] = useState(false)
  const [view, setView] = useState<WithdrawalCredentialView>(WithdrawalCredentialView.BASIC)
  const [isSharedCredentialVerified, setIsSharedCredentialVerified] = useState(false)
  const [isSharedSuggestedFeeVerified, setIsSharedSuggestedFeeVerified] = useState(false)
  const isAdvanceView = view === WithdrawalCredentialView.ADVANCED
  const isBasicView = view === WithdrawalCredentialView.BASIC
  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()

  useEffect(() => {
    setIsAll(valCount > 1)
  }, [valCount])

  useEffect(() => {
    if (hasAcceptedRisk) {
      onNextStep()
    }
  }, [hasAcceptedRisk])

  const isValidAddress = isAll
    ? Boolean(sharedCredentials)
    : candidates.every(({ withdrawalCredentials, suggestedFeeRecipient }) =>
        Boolean(withdrawalCredentials && suggestedFeeRecipient),
      )
  const isVerifiedAddress = isAll
    ? isSharedCredentialVerified && isSharedSuggestedFeeVerified
    : candidates.every(({ isVerifiedCredentials, isVerifiedSuggestedFee }) =>
        Boolean(isVerifiedCredentials && isVerifiedSuggestedFee),
      )

  const updateSharedCandidateData = useCallback(
    (_id: string, candidate: ValidatorCandidate) => {
      const {
        withdrawalCredentials,
        isVerifiedCredentials,
        suggestedFeeRecipient,
        isVerifiedSuggestedFee,
      } = candidate

      setIsSharedCredentialVerified(Boolean(isVerifiedCredentials))
      setIsSharedSuggestedFeeVerified(Boolean(isVerifiedSuggestedFee))
      onUpdateSharedCredentials(withdrawalCredentials)
      onUpdateSharedSuggestedFee(suggestedFeeRecipient)
    },
    [onUpdateSharedSuggestedFee, onUpdateSharedCredentials],
  )

  const updateCandidate = useCallback(
    (id: string, candidate: ValidatorCandidate) => {
      const index = candidates.findIndex((item) => item.id === id)
      if (index !== -1) {
        const updatedCandidates = [...candidates]
        updatedCandidates[index] = candidate
        onValidatorChange(updatedCandidates)
      }
    },
    [candidates, onValidatorChange],
  )

  const clearCredentials = () => {
    onUpdateSharedCredentials('')
    onUpdateSharedSuggestedFee('')
    const updatedCandidates = candidates.map((validator) => ({
      ...validator,
      withdrawalCredentials: '',
      suggestedFeeRecipient: '',
      isVerifiedCredentials: false,
      isVerifiedSuggestedFee: false,
    }))
    onValidatorChange(updatedCandidates)
    setIsSharedCredentialVerified(false)
    setIsSharedSuggestedFeeVerified(false)
  }

  const toggleAssignAllCredentials = useCallback((): void => {
    clearCredentials()
    setIsAll((prev) => !prev)
  }, [setIsAll, clearCredentials])

  const moveToNextStep = (): void => {
    if (!isVerifiedAddress) {
      onShowRisk()
      return
    }
    onNextStep()
  }

  const checkBoxClass = clsx('flex space-x-4', valCount < 2 && 'opacity-0 pointer-events-none')

  const advanceTabClass = clsx(
    'p-4 border-style border-b-0 cursor-pointer',
    isAdvanceView ? 'opacity-100' : 'opacity-40',
  )
  const basicTabClass = clsx(
    'p-4 border-style border-b-0 cursor-pointer border-r-0',
    isBasicView ? 'opacity-100' : 'opacity-40',
  )

  const allValidatorPlaceholder = useMemo(
    () =>
      ({
        id: 'all',
        name: t('validatorManagement.withdrawalCredentials.validatorGroup'),
        withdrawalCredentials: sharedCredentials,
        suggestedFeeRecipient: sharedSuggestedFeeRecipient,
        isVerifiedCredentials: isSharedCredentialVerified,
        isVerifiedSuggestedFee: isSharedSuggestedFeeVerified,
      }) as ValidatorCandidate,
    [
      sharedCredentials,
      sharedSuggestedFeeRecipient,
      isSharedCredentialVerified,
      isSharedSuggestedFeeVerified,
      t,
      isBasicView,
    ],
  )

  const renderedCredentialRows = useMemo(
    () =>
      candidates.map((validator, index) => (
        <ValidatorCredentialRow
          key={index}
          isAdvanceView={isAdvanceView}
          validatorCandidate={validator}
          onUpdateCandidate={updateCandidate}
        />
      )),
    [candidates, updateCandidate],
  )

  const renderedAllValidatorRow = useMemo(
    () => (
      <ValidatorCredentialRow
        isAdvanceView={isAdvanceView}
        validatorCandidate={allValidatorPlaceholder}
        onUpdateCandidate={updateSharedCandidateData}
      />
    ),
    [isAdvanceView, allValidatorPlaceholder, updateSharedCandidateData],
  )

  const changeView = (view: WithdrawalCredentialView) => {
    setView(view)
    clearCredentials()
  }

  const setAdvancedView = () => {
    if (view === WithdrawalCredentialView.ADVANCED) return
    changeView(WithdrawalCredentialView.ADVANCED)
  }
  const setBasicView = () => {
    if (view === WithdrawalCredentialView.BASIC) return
    changeView(WithdrawalCredentialView.BASIC)
  }

  return (
    <div className='w-full flex-1 flex flex-col relative space-y-6'>
      <div>
        <Typography type='text-caption1'>
          {t('validatorManagement.withdrawalCredentials.title')} --
        </Typography>
        <Typography type='text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.withdrawalCredentials.subTitle')}
        </Typography>
      </div>
      <div ref={parentRef} className='mt-4 w-full flex-1 max-w-[800px] space-y-8'>
        <div className='w-full'>
          <InfoBox
            isActive={isActive}
            animDelay={0.4}
            text={t('validatorManagement.withdrawalCredentials.warningText')}
            type={InfoBoxType.NOTICE}
          />
        </div>
        <div ref={targetChildRef} style={{ maxHeight: maxHeight }} className='w-full flex flex-col'>
          <div className='w-full flex'>
            <div onClick={setBasicView} className={basicTabClass}>
              <Typography type='text-caption1.5'>Basic Settings</Typography>
            </div>
            <div onClick={setAdvancedView} className={advanceTabClass}>
              <Typography type='text-caption1.5'>Advanced Settings</Typography>
            </div>
          </div>
          <div className='w-full border-style px-4 py-2 flex space-x-2'>
            <div className='w-[250px] border-r border-r-style pr-2'>
              <Typography type='text-caption1'>{t('validatorManagement.validators')}</Typography>
            </div>
            <div className='flex-1 flex items-center justify-between'>
              <div className={checkBoxClass}>
                <CheckBox
                  checked={isAll}
                  onChange={toggleAssignAllCredentials}
                  id='all_credentials'
                />
                <Typography type='text-caption1'>
                  {t('validatorManagement.withdrawalCredentials.assignAllValidators')}
                </Typography>
              </div>
              <div className='border-r dark:border-r-primary pr-2'>
                <Typography>{valCount}</Typography>
              </div>
            </div>
          </div>
          <div className='w-full h-full overflow-auto'>
            {isAll ? renderedAllValidatorRow : renderedCredentialRows}
          </div>
        </div>
        <StepOptions
          onBackStep={onBackStep}
          onNextStep={moveToNextStep}
          isDisabledNext={!isValidAddress}
        />
      </div>
    </div>
  )
}

export default WithdrawalCredentials
