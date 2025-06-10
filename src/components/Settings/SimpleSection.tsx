import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'
import Typography from '../Typography/Typography'

export interface SimpleSectionProps {
  children: ReactNode
  style?: 'vertical' | 'horizontal'
  title: string
  text: string
}

const SimpleSection: FC<SimpleSectionProps> = ({ children, title, text, style = 'horizontal' }) => {
  const classes = clsx('w-full flex', style === 'vertical' ? 'flex-col' : 'justify-between')

  return (
    <div className={classes}>
      <div className='space-y-2'>
        <Typography
          type='text-subtitle3'
          color='text-transparent'
          className='primary-gradient-text'
          fontWeight='font-light'
        >
          {title}
        </Typography>
        <div className='w-full max-w-xl'>
          <Typography type='text-caption1'>{text}</Typography>
        </div>
      </div>
      {children}
    </div>
  )
}

export default SimpleSection
