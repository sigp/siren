import { FC, InputHTMLAttributes, KeyboardEvent, ReactNode, useState } from 'react'
import addClassString from '../../../utilities/addClassString'
import useClickOutside from '../../hooks/useClickOutside'

export interface InlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
  containerClass?: string | undefined
  inputClass?: string | undefined
}

const InlineInput: FC<InlineInputProps> = ({
  value,
  onChange,
  children,
  type,
  containerClass,
  inputClass,
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const { ref } = useClickOutside(() => setIsEdit(false))

  const containerClasses = addClassString('cursor-pointer', [containerClass])
  const inputClasses = addClassString(
    'text-dark900 dark:text-dark300 font-openSauce text-caption1 px-2 py-1 outline-none bg-transparent border-style dark:bg-dark600_20 rounded-lg',
    [inputClass],
  )

  const finishEditCandidate = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      setIsEdit(false)
    }
  }

  const editCandidate = () => {
    setIsEdit(true)
    setTimeout(() => {
      ref.current?.focus()
    }, 100)
  }

  return (
    <div onClick={editCandidate} className={containerClasses}>
      {isEdit ? (
        <input
          ref={ref as any}
          value={value}
          onKeyUp={finishEditCandidate}
          onChange={onChange}
          className={inputClasses}
          type={type}
        />
      ) : (
        children
      )}
    </div>
  )

  return
}

export default InlineInput
