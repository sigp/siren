import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import { OptionalBoolean } from '../../types'

export interface ToggleProps {
  id: string
  value?: OptionalBoolean
  onChange: (value: boolean) => void
  width?: number
  height?: number
}

const Toggle: FC<ToggleProps> = ({ id, value, onChange, width = 48, height = 24 }) => {
  const isChecked = Boolean(value)
  const padding = height / 6
  const thumbSize = height - 2 * padding
  const thumbLeft = isChecked ? width - thumbSize - padding : padding

  return (
    <label
      htmlFor={id}
      className={addClassString('relative inline-block cursor-pointer', [])}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <input
        type='checkbox'
        id={id}
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className='sr-only'
      />
      {/* Track */}
      <div
        className={addClassString('w-full h-full rounded-full transition-colors duration-500', [
          isChecked ? 'bg-primary150' : 'bg-dark600',
        ])}
      />
      {/* Button */}
      <div
        className='absolute bg-white rounded-full transition-all duration-500'
        style={{
          width: `${thumbSize}px`,
          height: `${thumbSize}px`,
          top: `${padding}px`,
          left: `${thumbLeft}px`,
        }}
      />
    </label>
  )
}

export default Toggle
