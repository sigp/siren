import React, { FC, Fragment } from 'react'
import Typography from '../Typography/Typography'

export interface SettingsHeaderProps {
  sections: string[]
}

const SettingsHeader: FC<SettingsHeaderProps> = ({ sections }) => {
  return (
    <div className='flex space-x-2 items-center border-b-style py-4'>
      {sections.map((section, index) => (
        <Fragment key={index}>
          <Typography isCapitalize type='text-subtitle2'>
            {section}
          </Typography>
          {index < sections.length - 1 && (
            <i className='text-caption1 dark:text-dark300 text-dark900 bi-chevron-right' />
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default SettingsHeader
