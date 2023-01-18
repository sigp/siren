import { ChangeEvent, FC, useMemo, useState } from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import Typography, { TypographyColor } from '../Typography/Typography'
import DropDown from '../DropDown/DropDown'
import { useTranslation } from 'react-i18next'

export type OptionType = string | number

export type SelectOption = {
  title: string
  value?: OptionType
}

export interface SelectDropDownProps {
  options: SelectOption[]
  label?: string
  placeholder?: string
  value?: OptionType
  color?: TypographyColor
  isFilter?: boolean
  onSelect: (selection: OptionType) => void
}

const SelectDropDown: FC<SelectDropDownProps> = ({
  options,
  onSelect,
  value,
  color,
  label,
  isFilter,
  placeholder,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [isOpen, toggle] = useState(false)

  const toggleDropdown = () => toggle((prevState) => !prevState)
  const makeSelection = (selection: OptionType) => {
    onSelect(selection)
    toggle(false)
    setQuery('')
  }

  const setFilter = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)

  const { ref } = useClickOutside<HTMLDivElement>(() => {
    setQuery('')
    toggle(false)
  })

  const activeSelection = options.find((option) => (option.value || option.title) === value)

  const filteredOptions = useMemo(() => {
    return options.filter((option) => {
      const formattedQuery = query.toLowerCase()
      const isValue = option?.value?.toLocaleString().toLowerCase().includes(formattedQuery)
      const isTitle = option.title.toLowerCase().includes(formattedQuery)
      return query ? isTitle || isValue : true
    })
  }, [query, options])

  return (
    <div className='w-36'>
      {label && (
        <Typography type='text-caption1' color={color} className='xl:text-body'>
          {label}
        </Typography>
      )}
      <div ref={ref} className='relative'>
        <button
          onClick={toggleDropdown}
          id='dropdownDefault'
          data-dropdown-toggle='dropdown'
          className='w-full space-x-2 focus:outline-none text-center flex items-center justify-between'
          type='button'
        >
          <Typography color={color} className='capitalize'>
            {activeSelection ? activeSelection.title : placeholder || t('makeSelection')}
          </Typography>
          <i className={`bi-chevron-down ${color || 'text-dark900'} dark:text-dark300`} />
        </button>
        <DropDown className='mt-2' isOpen={isOpen}>
          <>
            {isFilter && (
              <div className='w-full bg-white dark:bg-black sticky top-0'>
                <input
                  onChange={setFilter}
                  value={query}
                  type='text'
                  placeholder='Search...'
                  className='w-full p-2 border-b-style500 outline-none bg-transparent dark:text-white'
                />
              </div>
            )}
            {filteredOptions.map(({ title, value }, index) => (
              <li
                onClick={() => makeSelection(value !== undefined ? value : title)}
                className='block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'
                key={index}
                data-testid='option'
              >
                <Typography className='capitalize'>{title}</Typography>
              </li>
            ))}
          </>
        </DropDown>
      </div>
    </div>
  )
}

export default SelectDropDown
