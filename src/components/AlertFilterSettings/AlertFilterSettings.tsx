import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useClickOutside from '../../hooks/useClickOutside'
import { StatusColor } from '../../types'
import DropDown from '../DropDown/DropDown'

export type FilterValue = StatusColor | 'all'

export interface AlertFilterSettingsProps {
  onChange: (value: FilterValue) => void
  value: FilterValue
}

const AlertFilterSettings: FC<AlertFilterSettingsProps> = ({ onChange, value }) => {
  const { t } = useTranslation()
  const [isOpen, toggle] = useState(false)

  const openDrop = () => toggle(true)
  const closeDrop = () => toggle(false)

  const { ref } = useClickOutside<HTMLDivElement>(closeDrop)

  const selectOption = (value: FilterValue) => {
    onChange(value)
    closeDrop()
  }
  const filterOptions = [
    { text: t('alertMessages.all'), value: 'all' },
    { text: t('alertMessages.severe'), value: StatusColor.ERROR },
    { text: t('alertMessages.warning'), value: StatusColor.WARNING },
    { text: t('alertMessages.fair'), value: StatusColor.SUCCESS },
  ]

  return (
    <div ref={ref} className='relative z-50'>
      <i onClick={openDrop} className='bi-sliders2 text-dark400 cursor-pointer' />
      <DropDown isScroll={false} width='w-42' position='right-0' isOpen={isOpen}>
        {filterOptions.map((option, index) => (
          <li
            key={index}
            className='block cursor-pointer flex justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'
            onClick={() => selectOption(option.value as FilterValue)}
          >
            {option.text}
            {option.value === value && <i className='bi-check-circle' />}
          </li>
        ))}
      </DropDown>
    </div>
  )
}

export default AlertFilterSettings
