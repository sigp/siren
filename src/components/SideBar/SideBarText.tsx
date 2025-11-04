import Link from 'next/link'
import { FC } from 'react'
import addClassString from '../../../utilities/addClassString'
import { OptionalBoolean } from '../../types'
import Typography from '../Typography/Typography'

export interface SideBarTextProps {
  text: string
  isActive?: boolean
  isDisabled?: OptionalBoolean
  href?: string
  className?: string
}

const SideBarText: FC<SideBarTextProps> = ({ text, isActive, href, isDisabled, className }) => {
  const renderText = () => (
    <li>
      <Typography
        color={isActive ? 'text-dark900' : 'text-dark500'}
        darkMode={isActive ? 'dark:text-dark300' : 'dark:text-dark500'}
        isBold
        className='uppercase'
        type='text-tiny'
      >
        {text}
      </Typography>
    </li>
  )

  // Don't render Link for disabled items to prevent prefetch requests
  if (isDisabled) {
    return (
      <div
        className={addClassString('flex items-center h-6 w-full cursor-not-allowed opacity-20', [
          className,
        ])}
      >
        {renderText()}
      </div>
    )
  }

  return href ? (
    <Link
      className={addClassString('flex items-center h-6 w-full cursor-pointer', [className])}
      href={href}
      prefetch={false}
    >
      {renderText()}
    </Link>
  ) : (
    renderText()
  )
}

export default SideBarText
