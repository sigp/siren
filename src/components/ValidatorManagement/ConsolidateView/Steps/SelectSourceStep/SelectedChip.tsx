import { FC } from 'react'
import { useValidatorAliases } from '../../../../../hooks/useValidatorAliases'
import useValidatorName from '../../../../../hooks/useValidatorName'
import { ValidatorInfo } from '../../../../../types/validator'
import Typography from '../../../../Typography/Typography'

export interface SelectedChipProps {
  validator: ValidatorInfo
  onRemove: (pubKey: string) => void
}

const SelectedChip: FC<SelectedChipProps> = ({ validator, onRemove }) => {
  const { pubKey } = validator
  const { aliases } = useValidatorAliases()
  const validatorName = useValidatorName(validator, aliases || {})
  const removeSource = () => onRemove(pubKey)

  return (
    <div className='bg-primary_10 mr-4 mb-4 flex items-center rounded p-1 space-x-2'>
      <div className='h-4 w-4 hidden lg:block rounded-full bg-gradient-to-r from-primary to-tertiary' />
      <Typography type='text-caption2'>{validatorName}</Typography>
      <i
        onClick={removeSource}
        role='button'
        className='bi-x cursor-pointer dark:text-white text-primary'
      />
    </div>
  )
}

export default SelectedChip
