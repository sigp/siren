import Status, { StatusProps } from './Status'
import { Story } from '@storybook/react'

export default {
  title: 'Status Dot',
  component: Status,
}

const Template: Story<StatusProps> = (props) => <Status {...props} />

export const Success = Template.bind({})
Success.args = {
  status: 'bg-success',
}

export const Warning = Template.bind({})
Warning.args = {
  status: 'bg-warning',
}

export const Error = Template.bind({})
Error.args = {
  status: 'bg-error',
}
