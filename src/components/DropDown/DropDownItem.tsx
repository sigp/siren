import Typography from '../Typography/Typography';
import React, { FC } from 'react';

export interface DropDownItemProps {
  onClick: () => void
  text: string
}

const DropDownItem:FC<DropDownItemProps> = ({onClick, text}) => {
  return (
    <li
      onClick={onClick}
      className='block cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-dark750 dark:hover:text-white'
    >
      <Typography className='capitalize'>{text}</Typography>
    </li>
  )
}

export default DropDownItem