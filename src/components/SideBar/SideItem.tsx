import {FC, ReactElement} from "react";

export interface SideItemProps {
    children: ReactElement
    isActive?: boolean
    className?: string
    onClick?: () => void
}

const SideItem:FC<SideItemProps> = ({children, isActive, className, onClick}) => {
  return (
      <li onClick={onClick} className={`group relative h-6 ${className || ''} ${isActive ? 'text-primary' : 'hover:text-primary text-dark400'} cursor-pointer flex items-center justify-center`}>
          <div className={`${!isActive && 'group-hover:block hidden'} absolute bg-gradient-to-b from-primary to-secondary left-0 top-0 w-1 h-full`} />
          <div className="w-4 h-4">
              {children}
          </div>
      </li>
  )
}

export default SideItem;