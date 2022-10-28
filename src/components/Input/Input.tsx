import { FC, HTMLInputTypeAttribute, InputHTMLAttributes, useState } from 'react';
import Typography from '../Typography/Typography';
import { UiMode } from '../../constants/enums';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  tooltip?: string
  error?: string
  className?: string
  uiMode?: UiMode
}

const Input: FC<InputProps> = ({ label, tooltip, type, error, className, uiMode, ...props }) => {
  const [inputType, setType] = useState<HTMLInputTypeAttribute>(type || 'text')
  const isPasswordType = type === 'password'

  const togglePassword = () => setType((prev) => (prev === 'password' ? 'text' : 'password'))
  return (
    <div className='space-y-4 w-full'>
      {label && (
        <div className='flex items-center space-x-2'>
          <Typography
            isBold
            family='font-archivo'
            color='text-dark500'
            className='uppercase md:text-caption1'
            type='text-caption2'
          >
            {label}
          </Typography>
          {tooltip && (
            <i className='bi-question-circle-fill text-caption2 md:text-caption1 text-dark500' />
          )}
        </div>
      )}
      <div className='relative w-full'>
        <input
          {...props}
          type={inputType}
          className={`${
            isPasswordType ? 'pr-5' : ''
          } ${className ? className : ''} pb-2 w-full ${uiMode === UiMode.LIGHT ? 'text-dark500 bg-dark10 border-dark500' : 'bg-transparent border-white placeholder:text-dark500'} font-light font-openSauce outline-none text-white border-b text-body md:text-subtitle1`}
        />
        {isPasswordType && (
          <i
            onClick={togglePassword}
            className={`cursor-pointer text-caption1 md:text-body ${
              inputType === 'password' ? 'bi-eye-slash-fill' : 'bi-eye-fill'
            } text-dark500 absolute right-0 top-1/2 -translate-y-1/2`}
          />
        )}
        <div className='absolute -bottom-6 left-0'>
          <Typography type='text-caption2' color='text-error' darkMode="dark:text-error" className='capitalize'>
            {error}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Input
