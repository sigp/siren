import { FC, FormEvent, ReactElement, useEffect } from 'react';
import { Control, useForm } from 'react-hook-form'
import useLocalStorage from '../hooks/useLocalStorage';

export interface AuthFormProps {
  children: (props: RenderProps) => ReactElement
  onSubmit: (token: string, username: string) => void
  isVisible: boolean
}

export interface AuthForm {
  username: string
  password: string
}

export interface RenderProps {
  control: Control<AuthForm>
  isValid: boolean
}

const AuthenticationForm: FC<AuthFormProps> = ({ children, onSubmit, isVisible }) => {
  const [username] = useLocalStorage<string>('username', 'Keeper')

  const {
    control,
    watch,
    reset,
  } = useForm<AuthForm>({
    defaultValues: {
      username,
      password: '',
    },
    mode: 'onChange'
  })

  useEffect(() => {
    if(!isVisible) {
      reset()
    }
  }, [isVisible, reset])

  const password = watch('password')
  const name = watch('username')

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    if(password) {
      onSubmit(password, name)
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
