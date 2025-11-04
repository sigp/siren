import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { FC, FormEvent, ReactElement, useState } from 'react'
import { Control, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import displayToast from '../../utilities/displayToast'
import { useAliasMigration } from '../hooks/useAliasMigration'
import useLocalStorage from '../hooks/useLocalStorage'
import { useValidatorAliases } from '../hooks/useValidatorAliases'
import useValidatorName from '../hooks/useValidatorName'
import { validatorAliases } from '../recoil/atoms'
import { ToastType, ValAliases } from '../types'
import { ValidatorInfo } from '../types/validator'
import { editValidatorValidation } from '../validation/editValidatorValidation'

export interface EditValidatorFormProps {
  validator: ValidatorInfo
  children: (props: RenderProps) => ReactElement
}

export interface EditValidatorForm {
  nameString: string
}

export interface RenderProps {
  control: Control<EditValidatorForm>
  isLoading: boolean
  isValid: boolean
}

const EditValidatorForm: FC<EditValidatorFormProps> = ({ children, validator }) => {
  const { t } = useTranslation()
  const { index } = validator
  const [isLoading, setLoading] = useState(false)
  const setAlias = useSetRecoilState(validatorAliases)
  const { aliases, updateAlias } = useValidatorAliases()
  const [localAliases] = useLocalStorage<ValAliases>('val-aliases', {})
  useAliasMigration()

  // Use API aliases if available, fallback to localStorage for migration
  const currentAliases = aliases || localAliases
  const validatorName = useValidatorName(validator, currentAliases)

  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm<EditValidatorForm>({
    defaultValues: {
      nameString: validatorName,
    },
    mode: 'onChange',
    resolver: yupResolver(editValidatorValidation),
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { nameString } = getValues()

    if (!nameString) {
      setLoading(false)
      return
    }

    try {
      await updateAlias(index, nameString)
      setAlias((prev) => ({ ...prev, [index]: nameString }))
      displayToast(t('validatorEdit.successUpdate'), ToastType.SUCCESS)
    } catch (_) {
      displayToast('Failed to update validator name', ToastType.ERROR)
    }
    setLoading(false)
  }

  return (
    <form className='w-full' onSubmit={onSubmit}>
      {children &&
        children({
          control,
          isLoading,
          isValid,
        })}
    </form>
  )
}

export default EditValidatorForm
