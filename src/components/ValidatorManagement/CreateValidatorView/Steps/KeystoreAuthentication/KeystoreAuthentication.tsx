import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../../../../utilities/addClassString'
import { ValidatorCandidate } from '../../../../../types'
import CheckBox from '../../../../CheckBox/CheckBox'
import FlexedOverflow from '../../../../FlexedOverflow/FlexedOverflow'
import InfoBox, { InfoBoxType } from '../../../../InfoBox/InfoBox'
import Typography from '../../../../Typography/Typography'
import StepOptions, { StepOptionsProps } from '../../StepOptions'
import KeystoreAuthRow from './KeystoreAuthRow'

export interface KeystoreAuthenticationProps extends Omit<StepOptionsProps, 'isDisabledNext'> {
  candidates: ValidatorCandidate[]
  sharedKeystorePassword: string
  setSharedKeystorePassword: (password: string) => void
  onUpdateCandidates: (candidates: ValidatorCandidate[]) => void
}

const KeystoreAuthentication: FC<KeystoreAuthenticationProps> = ({
  onBackStep,
  onNextStep,
  candidates,
  onUpdateCandidates,
  sharedKeystorePassword,
  setSharedKeystorePassword,
}) => {
  const { t } = useTranslation()
  const [isAll, setIsAll] = useState(false)
  const candidateCount = candidates.length

  const isValidAuthentication = isAll
    ? Boolean(sharedKeystorePassword)
    : candidates.every(({ keyStorePassword }) => Boolean(keyStorePassword))

  const checkBoxClass = addClassString('flex space-x-4', [
    candidateCount < 2 && 'opacity-0 pointer-events-none',
  ])

  const groupCandidate = {
    id: 'all',
    name: t('validatorManagement.withdrawalCredentials.validatorGroup'),
    withdrawalCredentials: '',
    isVerifiedCredentials: true,
    keyStorePassword: sharedKeystorePassword,
  } as ValidatorCandidate

  const toggleAssignAllCredentials = (): void => {
    const updatedCandidates = candidates.map((validator) => ({
      ...validator,
      keyStorePassword: '',
    }))
    onUpdateCandidates(updatedCandidates)
    setIsAll((prev) => !prev)
    setSharedKeystorePassword('')
  }

  const updateCandidatePassword = (id: string, password: string) => {
    const index = candidates.findIndex((item) => item.id === id)
    if (index !== -1) {
      const updatedCandidates = [...candidates]
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        keyStorePassword: password,
      }
      onUpdateCandidates(updatedCandidates)
    }
  }

  const updateSharedCandidatePassword = (_id: string, password: string) =>
    setSharedKeystorePassword(password)

  useEffect(() => {
    if (candidateCount > 1) {
      setIsAll(true)
    }
  }, [candidateCount])

  return (
    <div className='w-full h-full flex flex-col relative space-y-4'>
      <div>
        <Typography type='text-caption1'>
          {t('validatorManagement.keystoreAuthentication.title')} --
        </Typography>
        <Typography type='text-subtitle2' fontWeight='font-light'>
          {t('validatorManagement.keystoreAuthentication.subTitle')}
        </Typography>
      </div>
      <div className='w-full flex flex-col flex-1 max-w-[750px] 2xl:max-w-[900px] space-y-6'>
        {candidateCount < 2 || isAll ? (
          <InfoBox
            isActive
            animDelay={0.4}
            text={t('validatorManagement.keystoreAuthentication.warningText')}
            type={InfoBoxType.NOTICE}
          />
        ) : (
          <Typography type='text-caption1'>
            {t('validatorManagement.keystoreAuthentication.warningText')}
          </Typography>
        )}
        <div className='w-full flex flex-col flex-1'>
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
                <Typography>{candidateCount}</Typography>
              </div>
            </div>
          </div>
          {isAll ? (
            <KeystoreAuthRow
              onConfirmation={updateSharedCandidatePassword}
              candidate={groupCandidate}
            />
          ) : candidateCount === 1 ? (
            <KeystoreAuthRow
              onConfirmation={updateCandidatePassword}
              candidate={candidates[0]}
              index={candidates[0].index}
            />
          ) : (
            <FlexedOverflow>
              {candidates.map((candidate, index) => (
                <KeystoreAuthRow
                  key={index}
                  onConfirmation={updateCandidatePassword}
                  candidate={candidate}
                  index={candidate.index}
                />
              ))}
            </FlexedOverflow>
          )}
        </div>
        <StepOptions
          onBackStep={onBackStep}
          onNextStep={onNextStep}
          isDisabledNext={!isValidAuthentication}
        />
      </div>
    </div>
  )
}

export default KeystoreAuthentication
