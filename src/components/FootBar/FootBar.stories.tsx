import { Story } from '@storybook/react'
import FootBar from './FootBar'

export default {
  key: 'FootBar',
  component: FootBar,
}

const Template: Story = () => <FootBar />

export const Base = Template.bind({})
Base.args = {}
