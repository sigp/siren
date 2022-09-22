import SideBar from './SideBar'
import { Story } from '@storybook/react'

export default {
  key: 'SideBar',
  component: SideBar,
}

const Template: Story = () => (
  <div className='w-screen h-screen overflow-hidden'>
    <SideBar />
  </div>
)

export const Base = Template.bind({})
Base.args = {}
