import { Story } from '@storybook/react'
import React from 'react'

import Typography, { TypographyProps, TypographyType } from './Typography'

export default {
  title: 'Typography',
  component: Typography,
}

const Template: Story<TypographyProps> = ({ children, ...args }) => {
  const settings: TypographyType[] = [
    'text-caption2',
    'text-caption1',
    'text-body',
    'text-subtitle2',
    'text-subtitle1',
    'text-h3',
    'text-h2',
    'text-h1',
    'text-title',
  ]

  return (
    <ul className='p-0 border-none'>
      {settings.map((tag, index) => (
        <li className='flex items-center border-b border-black py-4' key={index}>
          <div className='uppercase'>
            <Typography {...args} type={tag}>
              <>{tag}</>
            </Typography>
          </div>
          <div className='ml-4'>
            <Typography {...args} type={tag}>
              {children}
            </Typography>
          </div>
        </li>
      ))}
    </ul>
  )
}

export const OpenSauce = Template.bind({})
OpenSauce.args = {
  children: 'Select the Ethereum 1.0 client',
}

export const Roboto = Template.bind({})
Roboto.args = {
  children: 'LOGS STARTING Activity --at-most',
  family: 'font-roboto',
}

export const Archivo = Template.bind({})
Archivo.args = {
  children: 'View important disclosures',
  family: 'font-archivo',
  className: 'uppercase',
}

export const PrimaryColorText = Template.bind({})
PrimaryColorText.args = {
  children: 'Primary Color Text',
  family: 'font-archivo',
  className: 'uppercase',
  color: 'text-primary',
}

export const LightColorText = Template.bind({})
LightColorText.args = {
  children: 'Light Text Color',
  color: 'text-dark300',
  fontWeight: 'font-light',
}

export const BoldText = Template.bind({})
BoldText.args = {
  children: 'Bold Text',
  isBold: true,
}
