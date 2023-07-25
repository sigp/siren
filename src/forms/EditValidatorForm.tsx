import { FC, ReactElement } from 'react'
import { Control, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { editValidatorValidation } from '../validation/editValidatorValidation'
import { ValidatorInfo } from '../types/validator'
import { useSetRecoilState } from 'recoil'
import { validatorAliases } from '../recoil/atoms'
import displayToast from '../utilities/displayToast'
import useLocalStorage from '../hooks/useLocalStorage'
import { ToastType, ValAliases } from '../types'
import { useTranslation } from 'react-i18next'

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
  onSubmit: () => void
}

const EditValidatorForm: FC<EditValidatorFormProps> = ({ children, validator }) => {
  const { t } = useTranslation()
  const { index } = validator
  const setAlias = useSetRecoilState(validatorAliases)
  const [aliases, storeValAliases] = useLocalStorage<ValAliases>('val-aliases', {})

  const {
    control,
    getValues,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      nameString: '',
    },
    mode: 'onChange',
    resolver: yupResolver(editValidatorValidation),
  })

  const onSubmit = () => {
    const { nameString } = getValues()
    setAlias((prev) => ({ ...prev, [index]: nameString }))
    storeValAliases({ ...aliases, [index]: nameString })

    displayToast(t('validatorEdit.successUpdate'), ToastType.SUCCESS)

    reset()
  }

  return (
    <form className='w-full h-full' action=''>
      {children &&
        children({
          control,
          isLoading: false,
          isValid,
          onSubmit,
        })}
    </form>
  )
}

export default EditValidatorForm
