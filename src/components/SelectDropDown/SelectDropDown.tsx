import { ChangeEvent, FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import useClickOutside from '../../hooks/useClickOutside'
import DropDown from '../DropDown/DropDown'
import Typography, { TypographyColor } from '../Typography/Typography'

export type OptionType = string | number

export type SelectOption = {
  title: string
  value?: OptionType
}

export interface SelectDropDownProps {
  options: SelectOption[]
  className?: string
  label?: string
  placeholder?: string
  value?: OptionType
  color?: TypographyColor
  excludeSelection?: boolean
  isFilter?: boolean
  onSelect: (selection: OptionType) => void
}

const SelectDropDown: FC<SelectDropDownProps> = ({
  options,
  onSelect,
  value,
  color,
  className,
  label,
  isFilter,
  excludeSelection,
  placeholder,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [isOpen, toggle] = useState(false)
  const activeSelection = options.find((option) => (option.value || option.title) === value)

  const filteredOptions = useMemo(() => {
    const formattedQuery = query.toLowerCase()
    return options.filter((option) => {
      const { value, title } = option
      const isValue = value?.toLocaleString().toLowerCase().includes(formattedQuery)
      const isTitle = title?.toLowerCase().includes(formattedQuery)
      const isExcluded = value === activeSelection?.value
      return !(isExcluded && excludeSelection) && (isTitle || isValue || !query)
    })
  }, [query, options, excludeSelection, activeSelection])

  const classes = addClassString('w-36', [className])

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

  return (
    <div className={classes}>
      {label && (
        <Typography type='text-caption1' color={color} className='xl:text-body'>
          {label}
        </Typography>
      )}
      <div ref={ref} className='relative'>
        <button
          onClick={toggleDropdown}
          id='dropdownDefault'
          disabled={!filteredOptions.length}
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
                className='block cursor-pointer flex justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'
                key={index}
                data-testid='option'
              >
                <Typography isCapitalize>{title}</Typography>
              </li>
            ))}
          </>
        </DropDown>
      </div>
    </div>
  )
}

export default SelectDropDown
