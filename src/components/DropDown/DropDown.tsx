import React, { FC, ReactElement } from 'react'

export interface DropDownProps {
  isOpen: boolean
  children: ReactElement | ReactElement[]
  width?: string
  className?: string
  position?: string
}

const DropDown: FC<DropDownProps> = ({
  children,
  isOpen,
  width,
  className = '',
  position = 'top-full left-0 z-50',
}) => {
  return (
    <div
      id='dropdown'
      className={`${isOpen ? 'absolute' : 'hidden'} ${
        width || 'w-full'
      } ${className} ${position} animate-fadeSlideIn bg-white rounded divide-y divide-gray-100 shadow dark:bg-black`}
    >
      <ul
        className='text-sm max-h-32 overflow-scroll relative text-gray-700 dark:text-gray-200'
        aria-labelledby='dropdownDefault'
      >
        {children}
      </ul>
    </div>
  )
}

export default DropDown
