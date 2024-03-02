import { FC } from 'react'
import { OptionalBoolean } from '../../types'

export interface ToggleProps {
  id: string
  value?: OptionalBoolean
  onChange: (value: boolean) => void
}

const Toggle: FC<ToggleProps> = ({ id, value, onChange }) => {
  return (
    <label htmlFor={id} className='flex relative w-12 items-center cursor-pointer'>
      <input
        onChange={(e) => onChange(e.target.checked)}
        checked={value}
        type='checkbox'
        value=''
        id={id}
        className='sr-only peer'
      />
      <div className="w-full relative h-6 bg-dark600 outline-none rounded-full peer peer-checked:after:translate-x-full  peer-checked:after:left-3 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white ease-in-out duration-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary150" />
    </label>
  )
}

export default Toggle
