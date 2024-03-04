import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'

export interface CheckBoxProps {
  className?: string
  id: string
  label?: string
  value?: string
  checked?: boolean
  onChange?: () => void
}

const CheckBox: FC<CheckBoxProps> = ({ id, className, label, value, checked, onChange }) => {
  const classes = addClassString('flex items-center', [className])
  return (
    <div className={classes}>
      <input
        data-testid='checkbox'
        onChange={onChange}
        checked={checked}
        id={id}
        type='checkbox'
        value={value}
        className='w-5 rounded h-5 border-gray-300 accent-primary bg-transparent border-style500 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:border-gray-600'
      />
      {label && (
        <label
          data-testid='checkbox-label'
          htmlFor={id}
          className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default CheckBox
