import { FC } from 'react'
import { ValidatorInfo } from '../../../../../types/validator'
import Typography from '../../../../Typography/Typography'

export interface SelectedChipProps {
  validator: ValidatorInfo
  onRemove: (pubKey: string) => void
}

const SelectedChip: FC<SelectedChipProps> = ({ validator, onRemove }) => {
  const { pubKey, name } = validator
  const removeSource = () => onRemove(pubKey)

  return (
    <div className='bg-primary_10 mr-4 mb-4 flex items-center rounded p-1 space-x-2'>
      <div className='h-4 w-4 rounded-full bg-gradient-to-r from-primary to-tertiary' />
      <Typography type='text-caption2'>{name}</Typography>
      <i onClick={removeSource} role='button' className='bi-x cursor-pointer text-white' />
    </div>
  )
}

export default SelectedChip
