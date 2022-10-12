import { FC, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import Typography, { TypographyColor } from '../Typography/Typography';

export type OptionType = string | number

export type SelectOption = {
  title: string,
  value?: OptionType
}

export interface SelectDropDownProps {
  options: SelectOption[],
  label?: string,
  placeholder?: string,
  value?: OptionType,
  color?: TypographyColor,
  onSelect: (selection: OptionType) => void
}

const SelectDropDown:FC<SelectDropDownProps> = ({options, onSelect, value, color, label, placeholder}) => {
  const [isOpen, toggle] = useState(false);

  const toggleDropdown = () => toggle(prevState => !prevState)
  const makeSelection = (selection: OptionType) => {
    onSelect(selection);
    toggle(false)
  }

  const { ref } = useClickOutside<HTMLDivElement>(() => toggle(false))

  const activeSelection = options.find(option => (option.value || option.title) === value)

  return (
    <div  className="w-36">
      {label && (
        <Typography type='text-caption1' color={color} className='xl:text-body'>{label}</Typography>
      )}
      <div ref={ref} className="relative">
        <button onClick={toggleDropdown} id="dropdownDefault" data-dropdown-toggle="dropdown"
                className="w-full space-x-2 focus:outline-none text-center flex items-center justify-between"
                type="button">
          <Typography color={color} className="capitalize">{activeSelection ? activeSelection.title : placeholder || 'make selection'}</Typography>
          <i className={`bi-chevron-down ${color || 'text-dark900'} dark:text-dark300`}/>
        </button>
        <div id="dropdown" className={`${isOpen ? 'absolute' : 'hidden'} animate-fadeSlideIn mt-2 top-full left-0 z-10 w-full bg-white rounded divide-y divide-gray-100 shadow dark:bg-black`}>
          <ul className="text-sm max-h-48 overflow-scroll text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
            {
              options.map(({title, value}, index) => (
                <li onClick={() => makeSelection(value !== undefined ? value : title)} className="block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white" key={index}>
                  <Typography className="capitalize">{title}</Typography>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SelectDropDown;