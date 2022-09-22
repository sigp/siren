import TopBar from './TopBar'
import { Story } from '@storybook/react'

export default {
  key: 'TopBar',
  component: TopBar,
}

const Template: Story = () => <TopBar />

export const Base = Template.bind({})
Base.args = {}
