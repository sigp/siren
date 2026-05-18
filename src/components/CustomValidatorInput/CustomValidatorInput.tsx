import { FC, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import { MAX_EFFECTIVE_BALANCE } from '../../constants/constants'
import { useNetworkProfile } from '../../hooks/useNetworkProfile'
import { BeaconValidatorResult } from '../../types/validator'
import { ValidatorInfo } from '../../types/validator'
import Button, { ButtonFace } from '../Button/Button'
import Input from '../Input/Input'
import Typography from '../Typography/Typography'

export interface CustomValidatorInputProps {
  onValidatorFound: (validator: ValidatorInfo) => void
  onValidatorClear: () => void
  className?: string
}

const CustomValidatorInput: FC<CustomValidatorInputProps> = ({
  onValidatorFound,
  onValidatorClear,
  className = '',
}) => {
  const { t } = useTranslation()
  const { nativeSymbol } = useNetworkProfile()
  const [inputValue, setInputValue] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [validatedValidator, setValidatedValidator] = useState<ValidatorInfo | null>(null)

  // Check if input is a valid pubkey format (0x + 96 hex chars) or validator index
  const inputType = useMemo(() => {
    if (!inputValue) return null

    // Check if it's a valid pubkey format
    if (inputValue.match(/^0x[0-9a-fA-F]{96}$/)) {
      return 'pubkey'
    }

    // Check if it's a valid validator index (positive integer)
    if (inputValue.match(/^\d+$/)) {
      return 'index'
    }

    return 'invalid'
  }, [inputValue])

  const validateValidator = useCallback(async () => {
    if (!inputValue || inputType === 'invalid') {
      setValidationError(t('validatorManagement.consolidateView.customTarget.invalidFormat'))
      return
    }

    setIsValidating(true)
    setValidationError('')

    try {
      let pubKey = inputValue

      // If input is an index, we need to fetch the validator by index to get the pubkey
      if (inputType === 'index') {
        const indexResponse = await fetch(`/api/validator-status/${inputValue}`)
        if (!indexResponse.ok) {
          throw new Error('Validator not found')
        }
        const indexData = await indexResponse.json()
        pubKey = indexData.data.validator.pubkey
      }

      // Fetch validator details by pubkey
      const response = await fetch(`/api/validator-status/${pubKey}`)
      if (!response.ok) {
        throw new Error('Validator not found')
      }

      const data = await response.json()
      const validatorDetail: BeaconValidatorResult = data.data

      // Check if validator has 0x02 withdrawal credentials (consolidation capable)
      if (!validatorDetail.validator.withdrawal_credentials.startsWith('0x02')) {
        setValidationError(
          t('validatorManagement.consolidateView.customTarget.notConsolidationCapable'),
        )
        return
      }

      // Get effective balance from validator data
      const currentEffectiveBalance = parseInt(validatorDetail.validator.effective_balance) / 1e9 // Convert from Gwei to ETH
      const currentBalance = parseInt(validatorDetail.balance) / 1e9 // Convert from Gwei to ETH

      // Check if target validator's effective balance is already at maximum
      if (currentEffectiveBalance >= MAX_EFFECTIVE_BALANCE) {
        setValidationError(
          t('validatorManagement.consolidateView.customTarget.alreadyAtMaxBalance'),
        )
        return
      }

      // Note: We don't validate the exact consolidation impact here since source validators
      // are selected in the next step. The detailed validation will happen later in the flow.

      // Create ValidatorInfo object for the custom validator
      const customValidator: ValidatorInfo = {
        name: `Validator ${validatorDetail.index}`,
        balance: currentBalance,
        effectiveBalance: currentEffectiveBalance,
        index: parseInt(validatorDetail.index),
        pubKey: validatorDetail.validator.pubkey,
        rewards: 0,
        slashed: validatorDetail.validator.slashed,
        withdrawalAddress: validatorDetail.validator.withdrawal_credentials,
        activationEpoch: parseInt(validatorDetail.validator.activation_epoch),
        status: validatorDetail.status,
        processed: 0,
        missed: 0,
        attested: 0,
        aggregated: 0,
      }

      setValidatedValidator(customValidator)
      onValidatorFound(customValidator)
    } catch (error) {
      console.error('Validator validation error:', error)
      setValidationError(t('validatorManagement.consolidateView.customTarget.validatorNotFound'))
    } finally {
      setIsValidating(false)
    }
  }, [inputValue, inputType, onValidatorFound, t])

  const clearValidator = useCallback(() => {
    setInputValue('')
    setValidatedValidator(null)
    setValidationError('')
    onValidatorClear()
  }, [onValidatorClear])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setValidationError('')
    if (validatedValidator) {
      setValidatedValidator(null)
      onValidatorClear()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='space-y-2'>
        <Typography type='text-caption1' isBold>
          {t('validatorManagement.consolidateView.customTarget.title')}
        </Typography>
        <Typography type='text-caption2' color='text-dark400'>
          {t('validatorManagement.consolidateView.customTarget.description')}
        </Typography>
      </div>

      {!validatedValidator ? (
        <div className='space-y-3'>
          <Input
            label={t('validatorManagement.consolidateView.customTarget.inputLabel')}
            placeholder={t('validatorManagement.consolidateView.customTarget.placeholder')}
            value={inputValue}
            onChange={handleInputChange}
            error={validationError}
            className='w-full'
            inputStyle='basic'
          />

          <div className='flex space-x-2'>
            <Button
              type={ButtonFace.SECONDARY}
              onClick={validateValidator}
              isLoading={isValidating}
              isDisabled={!inputValue || inputType === 'invalid'}
              className='flex-1'
            >
              {t('validatorManagement.consolidateView.customTarget.validate')}
            </Button>
          </div>

          {inputType === 'invalid' && inputValue && (
            <Typography type='text-caption2' color='text-warning'>
              {t('validatorManagement.consolidateView.customTarget.formatHelp')}
            </Typography>
          )}
        </div>
      ) : (
        <div className='border-style rounded p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <Typography
              type='text-caption1'
              isBold
              color='text-success'
              darkMode='dark:text-success'
            >
              {t('validatorManagement.consolidateView.customTarget.validated')}
            </Typography>
            <Button type={ButtonFace.TERTIARY} onClick={clearValidator} className='text-xs'>
              {t('validatorManagement.consolidateView.customTarget.clear')}
            </Button>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Typography type='text-caption2' color='text-dark400'>
                {t('index')}:
              </Typography>
              <Typography type='text-caption2'>{validatedValidator.index}</Typography>
            </div>

            <div className='flex items-center space-x-2'>
              <Typography type='text-caption2' color='text-dark400'>
                {t('publicKey')}:
              </Typography>
              <Typography type='text-caption2'>
                {formatEthAddress(validatedValidator.pubKey, 12, 12)}
              </Typography>
            </div>

            <div className='flex items-center space-x-2'>
              <Typography type='text-caption2' color='text-dark400'>
                {t('status')}:
              </Typography>
              <Typography type='text-caption2'>{validatedValidator.status}</Typography>
            </div>

            <div className='flex items-center space-x-2'>
              <Typography type='text-caption2' color='text-dark400'>
                {t('effectiveBalance')}:
              </Typography>
              <Typography type='text-caption2'>
                {validatedValidator.effectiveBalance.toFixed(2)} {nativeSymbol}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomValidatorInput
