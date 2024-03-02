import Typography from '../Typography/Typography'
import ValidatorActionIcon from '../ValidatorActionIcon/ValidatorActionIcon'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, FC, useState } from 'react'
import Input from '../Input/Input'
import { OptionalString } from '../../types'

export interface ValidatorGraffitiInputProps {
  value?: OptionalString
  isLoading?: boolean
  onSubmit: (value: string) => void
}

const ValidatorGraffitiInput: FC<ValidatorGraffitiInputProps> = ({
  value,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation()

  const [input, setInput] = useState('')

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const isDirty = input && value !== input
  const submitGraffiti = () => onSubmit(input as string)

  return (
    <div className='w-full border-t flex'>
      <div className='border-r py-2 px-2 md:px-6 md:w-42'>
        <Typography type='text-caption1' className='w-1/2'>
          {t('validatorGraffiti')}
        </Typography>
      </div>
      <div className='flex-1 flex justify-between items-center px-2 md:px-8 py-3'>
        <Input
          value={input}
          onChange={onChange}
          inputStyle='noBorder'
          className='text-caption1 placeholder:text-primary text-primary'
          placeholder={value || t('graffitiGoesHere')}
        />
        <ValidatorActionIcon
          onClick={submitGraffiti}
          isLoading={isLoading}
          isDisabled={!isDirty}
          icon='bi-pencil-square'
          color='text-primary'
        />
      </div>
    </div>
  )
}

export default ValidatorGraffitiInput
