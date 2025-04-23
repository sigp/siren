import clsx from 'clsx'
import React, { FC } from 'react'
import Typography from '../Typography/Typography'

export interface DisplayTextBoxProps {
  isError?: boolean
  title: string
  subTitle: string
}

const DisplayTextBox: FC<DisplayTextBoxProps> = ({ isError, title, subTitle }) => {
  const balanceBorderClasses = clsx(
    'border flex-1 p-4 text-center',
    isError ? 'border-error' : 'border-style',
  )

  return (
    <div className={balanceBorderClasses}>
      <Typography
        className='break-keep text-center'
        isBold
        type='text-subtitle1'
        color={isError ? 'text-error' : 'text-primary'}
        darkMode={isError ? 'dark:text-error' : 'dark:text-primary'}
      >
        {title}
      </Typography>
      <Typography
        type='text-tiny'
        className='max-w-[150px] text-center'
        color={isError ? 'text-error' : 'text-primary'}
        darkMode={isError ? 'dark:text-error' : 'dark:text-primary'}
      >
        {subTitle}
      </Typography>
    </div>
  )
}

export default DisplayTextBox
