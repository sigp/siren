import React, { FC, ReactElement } from 'react'
import addClassString from '../../../utilities/addClassString'

export interface DropDownProps {
  isOpen: boolean
  children: ReactElement | ReactElement[]
  width?: string
  className?: string
  position?: string
  isScroll?: boolean
}

const DropDown: FC<DropDownProps> = ({
  children,
  isOpen,
  width,
  isScroll = true,
  className = '',
  position = 'top-full left-0 z-50',
}) => {
  const classes = addClassString('text-sm relative text-gray-700 dark:text-gray-200', [
    isScroll && 'max-h-32 overflow-scroll',
  ])
  const containerClasses = addClassString(
    'animate-fadeSlideIn bg-white rounded divide-y divide-gray-100 shadow dark:bg-black',
    [position, className, width || 'w-full', isOpen ? 'absolute' : 'hidden'],
  )
  return (
    <div id='dropdown' className={containerClasses}>
      <ul className={classes} aria-labelledby='dropdownDefault'>
        {children}
      </ul>
    </div>
  )
}

export default DropDown
