import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { FC, FormEvent, ReactElement, useState } from 'react'
import { Control, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import displayToast from '../../utilities/displayToast'
import useLocalStorage from '../hooks/useLocalStorage'
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
  const [aliases, storeValAliases] = useLocalStorage<ValAliases>('val-aliases', {})

  const validatorName = useValidatorName(validator, aliases)

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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { nameString } = getValues()

    if (!nameString) return

    setAlias((prev) => ({ ...prev, [index]: nameString }))
    storeValAliases({ ...aliases, [index]: nameString })

    displayToast(t('validatorEdit.successUpdate'), ToastType.SUCCESS)
    setLoading(false)
  }

  return (
    <form className='w-full h-full' onSubmit={onSubmit}>
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
