import ProgressCircle, { ProgressCircleProps } from './ProgressCircle'
import { Story } from '@storybook/react'

export default {
  title: 'Progress Circle',
  component: ProgressCircle,
}

const Template: Story<ProgressCircleProps> = (props) => <ProgressCircle {...props} />

export const Base = Template.bind({})
Base.args = {
  id: 'base',
}

export const PartialPrimary = Template.bind({})
PartialPrimary.args = {
  percent: 25,
  id: 'partialPrimary',
}

export const FullPrimary = Template.bind({})
FullPrimary.args = {
  percent: 100,
  id: 'fullPrimary',
}

export const PartialSecondary = Template.bind({})
PartialSecondary.args = {
  percent: 25,
  color: 'secondary',
  id: 'partialSecondary',
}

export const FullSecondary = Template.bind({})
FullSecondary.args = {
  percent: 100,
  color: 'secondary',
  id: 'fullSecondary',
}

export const CounterClock = Template.bind({})
CounterClock.args = {
  percent: 25,
  color: 'secondary',
  direction: 'counter',
  id: 'counterClock',
}
