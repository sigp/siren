import FootBar from './FootBar'
import { Story } from '@storybook/react'

export default {
  key: 'FootBar',
  component: FootBar,
}

const Template: Story = () => <FootBar />

export const Base = Template.bind({})
Base.args = {}
