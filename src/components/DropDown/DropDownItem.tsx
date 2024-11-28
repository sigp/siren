import Link from 'next/link'
import React, { FC, ReactNode } from 'react'

export interface DropDownItemProps {
  children: ReactNode | ReactNode[]
  href: string
  target?: '_self' | '_blank' | '_parent' | '_top' | string | undefined
}

const DropDownItem: FC<DropDownItemProps> = ({ children, href, target }) => {
  return (
    <Link href={href} target={target}>
      <li className='block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'>
        {children}
      </li>
    </Link>
  )
}

export default DropDownItem
