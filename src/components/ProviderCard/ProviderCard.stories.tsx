import ProviderCard, { ProviderCardProps } from './ProviderCard'
import { Story } from '@storybook/react'

export default {
  key: 'ProviderCard',
  component: ProviderCard,
}

const Template: Story<ProviderCardProps> = (props) => (
  <div className='h-screen w-screen bg-black p-12'>
    <ProviderCard {...props} />
  </div>
)

export const Base = Template.bind({})
Base.args = {
  provider: 'GETH',
  title: 'Decentralized Full Node',
  id: 1,
  subTitle: 'Ethereum Foundation',
  language: 'Go',
}

export const Active = Template.bind({})
Active.args = {
  provider: 'GETH',
  title: 'Decentralized Full Node',
  id: 1,
  subTitle: 'Ethereum Foundation',
  language: 'Go',
  isActive: true,
}
