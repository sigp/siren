import Input, { InputProps } from './Input'
import { Story } from '@storybook/react'

export default {
  key: 'Input',
  component: Input,
}

const Template: Story<InputProps> = (props) => (
  <div className='h-screen w-screen bg-black flex items-center justify-center'>
    <Input {...props} />
  </div>
)

export const Base = Template.bind({})
Base.args = {}

export const LabledInput = Template.bind({})
LabledInput.args = {
  label: 'Username',
}

export const PlaceholderInput = Template.bind({})
PlaceholderInput.args = {
  label: 'Device Name',
  placeholder: 'Local Host',
}

export const PasswordInput = Template.bind({})
PasswordInput.args = {
  label: 'Api Token',
  placeholder: '***-*****-******',
  type: 'password',
}

export const ToolTipInput = Template.bind({})
ToolTipInput.args = {
  label: 'Label with tooltip',
  tooltip: 'hello world',
  placeholder: 'hover the tooltip',
}
