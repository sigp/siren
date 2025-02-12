import { FC, FormEvent, ReactElement, useEffect } from 'react'
import { Control, useForm } from 'react-hook-form'

export interface AuthFormProps {
  children: (props: RenderProps) => ReactElement
  onSubmit: (token: string) => void
  isVisible: boolean
}

export interface AuthForm {
  password: string
}

export interface RenderProps {
  control: Control<AuthForm>
  isValid: boolean
}

const AuthenticationForm: FC<AuthFormProps> = ({ children, onSubmit, isVisible }) => {
  const { control, watch, reset } = useForm<AuthForm>({
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (!isVisible) {
      reset()
    }
  }, [isVisible, reset])

  const password = watch('password')

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    if (password) {
      onSubmit(password)
    }
  }

  return (
    <form className='w-full h-full' onSubmit={submitForm}>
      {children &&
        children({
          control,
          isValid: !!password,
        })}
    </form>
  )
}

export default AuthenticationForm
