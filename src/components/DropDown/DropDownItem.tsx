import React, { FC, ReactNode } from 'react'

export interface DropDownItemProps {
  onClick?: () => void
  children: ReactNode | ReactNode[]
}

const DropDownItem: FC<DropDownItemProps> = ({ onClick, children }) => {
  return (
    <li
      onClick={onClick}
      className='block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'
    >
      {children}
    </li>
  )
}

export default DropDownItem
