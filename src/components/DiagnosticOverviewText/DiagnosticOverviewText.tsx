import { FC } from 'react'
import Typography from '../Typography/Typography'

export type OverviewStatus = 'text-success' | 'text-warning' | 'text-error'

export interface DiagnosticOverviewTextProps {
  text: string
  status: OverviewStatus
}

const DiagnosticOverviewText: FC<DiagnosticOverviewTextProps> = ({ text, status }) => {
  return (
    <div className='flex space-x-4 items-center'>
      <i className={`bi-plus-circle text-caption1 ${status}`} />
      <Typography type='text-caption1'>{text}</Typography>
    </div>
  )
}

export default DiagnosticOverviewText
