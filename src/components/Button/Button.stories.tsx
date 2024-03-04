import { ComponentMeta, Story } from '@storybook/react'
import Button, { ButtonFace, ButtonProps } from './Button'

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: Story<ButtonProps> = ({ children, ...props }) => (
  <Button {...props}>{children}</Button>
)

export const Base = Template.bind({})
Base.args = {
  children: 'Base Button',
}

export const BaseDisabled = Template.bind({})
BaseDisabled.args = {
  children: 'Disabled Button',
  isDisabled: true,
}

export const Secondary = Template.bind({})
Secondary.args = {
  type: ButtonFace.SECONDARY,
  children: 'Secondary Button',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  type: ButtonFace.TERTIARY,
  children: 'I Understand and Accept',
}

export const LinkButton = Template.bind({})
LinkButton.args = {
  type: ButtonFace.PRIMARY,
  children: 'Link Button',
  href: 'https://www.google.com/',
  target: '_blank',
}
