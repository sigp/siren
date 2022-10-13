import { Story } from '@storybook/react'
import SelectDropDown, { OptionType, SelectDropDownProps } from './SelectDropDown'
import { useState } from 'react'
import { EARNINGS_OPTIONS } from '../../constants/constants'

export default {
  key: 'SelectDropDown',
  component: SelectDropDown,
}

const Template: Story<SelectDropDownProps> = (props) => {
  const [selection, makeSelection] = useState<OptionType>(0)
  return <SelectDropDown {...props} value={selection} onSelect={makeSelection} />
}

export const Base = Template.bind({})
Base.args = {
  options: EARNINGS_OPTIONS,
  label: 'Select Currency',
}
