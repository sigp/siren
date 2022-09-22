import Toggle, { ToggleProps } from './Toggle'
import { Story } from '@storybook/react'
import { useState } from 'react'

export default {
  key: 'Toggle',
  component: Toggle,
}

const Template: Story<ToggleProps> = ({ value, ...props }) => {
  const [storyVale, setValue] = useState(value)
  return <Toggle value={storyVale} {...props} onChange={setValue} />
}

export const Base = Template.bind({})
Base.args = {
  id: 'toggle1',
}

export const ToggledOn = Template.bind({})
ToggledOn.args = {
  value: true,
  id: 'toggle2',
}
