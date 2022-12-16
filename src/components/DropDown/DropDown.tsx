import React, { FC, ReactElement } from 'react'

export interface DropDownProps {
  isOpen: boolean
  children: ReactElement | ReactElement[]
  width?: string
  bgColor?: string
  className?: string
  position?: string
}

const DropDown: FC<DropDownProps> = ({
  children,
  isOpen,
  width,
  bgColor = 'dark:bg-black bg-white',
  className = '',
  position = 'top-full left-0 z-50',
}) => {
  const isChildrenArray = Array.isArray(children)

  return (
    <div
      id='dropdown'
      className={`${isOpen ? 'absolute' : 'hidden'} ${
        width || 'w-full'
      } ${className} ${position} animate-fadeSlideIn rounded divide-y divide-gray-100 shadow ${bgColor}`}
    >
      <ul
        className={`text-sm max-h-32 overflow-scroll relative text-gray-700 dark:text-gray-200 ${
          isChildrenArray && children.length >= 4 ? 'pb-6' : ''
        }`}
        aria-labelledby='dropdownDefault'
      >
        {children}
      </ul>
    </div>
  )
}

export default DropDown
