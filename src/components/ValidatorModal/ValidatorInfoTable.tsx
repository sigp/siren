import clsx from 'clsx'
import React, { FC, Children } from 'react'
import TableWrapper, { TableWrapperProps } from '../TableWrapper/TableWrapper'
import Typography from '../Typography/Typography'

export interface ValidatorInfoTableProps extends TableWrapperProps {
  className?: string
  title: string
  emptyText: string
}

const ValidatorInfoTable: FC<ValidatorInfoTableProps> = ({
  className,
  title,
  children,
  headers,
  emptyText,
}) => {
  const containerClass = clsx('w-full', className)

  return (
    <div className={containerClass}>
      <div className='w-full flex flex-col items-center space-y-1 p-4 border-b-style100 dark:border-b-style'>
        <Typography
          color='text-dark400'
          darkMode='dark:text-dark500'
          type='text-caption1.5'
          className='text-center'
        >
          {title}
        </Typography>
        <i className='bi bi-arrow-down-circle text-caption1 text-primary' />
      </div>
      {Children.count(children) > 0 ? (
        <TableWrapper headers={headers}>{children}</TableWrapper>
      ) : (
        <div className='w-full flex items-center bg-dark25 dark:bg-dark900 justify-center h-32'>
          <Typography
            color='text-dark700'
            darkMode='dark:text-dark500'
            type='text-caption1.5'
            className='text-center'
          >
            {emptyText}
          </Typography>
        </div>
      )}
    </div>
  )
}

export default ValidatorInfoTable
