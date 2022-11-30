import { ChangeEvent, FC, useMemo, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside'
import Typography, { TypographyColor } from '../Typography/Typography'

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
  const [query, setQuery] = useState('');
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
    return options.filter(option => {
      const formattedQuery = query.toLowerCase()
      const isValue = option?.value?.toLocaleString().toLowerCase().includes(formattedQuery)
      const isTitle = option.title.toLowerCase().includes(formattedQuery)
      return query ? (isTitle || isValue) : true
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
            {activeSelection ? activeSelection.title : placeholder || 'make selection'}
          </Typography>
          <i className={`bi-chevron-down ${color || 'text-dark900'} dark:text-dark300`} />
        </button>
        <div
          id='dropdown'
          className={`${
            isOpen ? 'absolute' : 'hidden'
          } animate-fadeSlideIn mt-2 top-full left-0 z-10 w-full bg-white rounded divide-y divide-gray-100 shadow dark:bg-black`}
        >
          {isFilter && (
            <div className="w-full">
              <input onChange={setFilter} value={query} type="text" placeholder="Search..." className="w-full p-2 border-none outline-none bg-transparent dark:text-white" />
            </div>
          )}
          <ul
            className={`text-sm max-h-32 overflow-scroll text-gray-700 dark:text-gray-200 ${filteredOptions.length >=4 ? 'pb-6' : ''}`}
            aria-labelledby='dropdownDefault'
          >
            {filteredOptions.map(({ title, value }, index) => (
              <li
                onClick={() => makeSelection(value !== undefined ? value : title)}
                className='block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'
                key={index}
              >
                <Typography className='capitalize'>{title}</Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SelectDropDown
