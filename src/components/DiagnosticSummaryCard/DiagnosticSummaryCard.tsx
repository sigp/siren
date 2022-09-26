import Typography from '../Typography/Typography'
import { FC } from 'react'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'

export interface DiagnosticSummaryCardProps {
  type: DiagnosticType
  rate: DiagnosticRate
}

const DiagnosticSummaryCard: FC<DiagnosticSummaryCardProps> = ({ type, rate }) => {
  return (
    <div className='bg-dark25 flex flex-col justify-between h-full p-4 w-40 border border-dark400'>
      <div className='flex justify-between'>
        <Typography
          isBold
          family='font-archivo'
          type='text-caption1'
          className='uppercase'
          color='text-dark900'
        >
          {type} <br /> Diagnostic
        </Typography>
        <i className='bi-question-circle-fill text-dark300' />
      </div>
      <Typography type='text-tiny' isBold family='font-archivo' className='uppercase'>
        {rate}
      </Typography>
    </div>
  )
}

export default DiagnosticSummaryCard
