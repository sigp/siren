import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'
import Typography from '../Typography/Typography'

export interface TableWrapperProps {
  headers: string[]
  children: ReactNode
  className?: string
  headerCellClassName?: string
}

const TableWrapper: FC<TableWrapperProps> = ({
  headers,
  children,
  className,
  headerCellClassName,
}) => {
  const containerClass = clsx('w-full bg-dark25 dark:bg-dark900', className)
  const headerClasses = clsx('w-1/4 px-4 py-2 text-left', headerCellClassName)

  return (
    <div className={containerClass}>
      <table className='w-full table-fixed border-collapse'>
        <thead>
          <tr>
            {headers.map((title, index) => (
              <th key={index} className={headerClasses}>
                <Typography
                  isCapitalize
                  className='text-center'
                  color='text-dark400'
                  darkMode='dark:text-dark500'
                  type='text-caption1.5'
                >
                  {title}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export default TableWrapper
