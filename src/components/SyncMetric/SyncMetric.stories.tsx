import SyncMetric, { SyncMetricProps } from './SyncMetric'
import { Story } from '@storybook/react'

export default {
  key: 'SyncMetric',
  component: SyncMetric,
}

const Template: Story<SyncMetricProps> = (props) => <SyncMetric {...props} />

export const Base = Template.bind({})
Base.args = {
  title: 'ETHEREUM MAINNET',
  color: 'secondary',
  id: 'ethMain',
  total: 212245,
  amount: 150435,
}

export const CounterClock = Template.bind({})
CounterClock.args = {
  title: 'BEACON CHAIN',
  direction: 'counter',
  id: 'beaconChain',
  total: 212245,
  amount: 120435,
}
