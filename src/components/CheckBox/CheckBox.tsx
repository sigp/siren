import clsx from 'clsx'
import React, { FC, InputHTMLAttributes } from 'react'

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  containerClassName?: string
  labelStyle?: string
  inputClassName?: string
  checkboxBorderClasses?: string
}

const CheckBox: FC<CheckBoxProps> = ({
  id,
  label,
  containerClassName,
  labelStyle,
  inputClassName,
  checkboxBorderClasses,
  ...inputProps
}) => {
  const containerClasses = clsx('flex items-center cursor-pointer', containerClassName)
  const inputClasses = clsx(
    'w-5 h-5 cursor-pointer accent-primary bg-transparent rounded',
    'focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800',
    inputClassName,
    checkboxBorderClasses || 'border border-gray-300 border-style500 dark:border-gray-600',
  )
  const labelClasses = clsx(
    'ml-2 cursor-pointer text-gray-900 dark:text-gray-300',
    labelStyle || 'text-sm font-medium',
  )

  return (
    <div className={containerClasses}>
      <input
        id={id}
        data-testid='checkbox'
        type='checkbox'
        {...inputProps}
        className={inputClasses}
      />
      {label && (
        <label data-testid='checkbox-label' htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
    </div>
  )
}

export default CheckBox
