import { FC } from 'react'
import Spinner from '../Spinner/Spinner'

export interface TableColumnFallbackProps {
  size?: 'sm' | 'lg'
}

const TableColumnFallback: FC<TableColumnFallbackProps> = ({ size = 'sm' }) => {
  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center ${
        size === 'lg' ? 'xl:min-w-316' : ''
      } border border-dark200 dark:border-dark500`}
    >
      <Spinner />
    </div>
  )
}

export default TableColumnFallback
