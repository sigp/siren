import React, { FC, InputHTMLAttributes } from 'react'
import addClassString from '../../../utilities/addClassString'

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  containerClassName?: string
  labelStyle?: string
  inputClassName?: string
}

const CheckBox: FC<CheckBoxProps> = ({
  id,
  label,
  containerClassName,
  labelStyle,
  inputClassName,
  ...inputProps
}) => {
  const containerClasses = addClassString('flex items-center', [containerClassName])
  const inputClasses = addClassString(
    'w-5 h-5 border border-gray-300 accent-primary bg-transparent border-style500 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 dark:border-gray-600',
    [inputClassName],
  )
  const labelClasses = addClassString('ml-2 text-gray-900 dark:text-gray-300', [
    labelStyle || 'text-sm font-medium',
  ])

  return (
    <div className={containerClasses}>
      <input id={id} data-testid='checkbox' {...inputProps} className={inputClasses} />
      {label && (
        <label data-testid='checkbox-label' htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
    </div>
  )
}

export default CheckBox
