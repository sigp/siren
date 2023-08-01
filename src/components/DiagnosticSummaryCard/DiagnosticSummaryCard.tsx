import Typography from '../Typography/Typography'
import { FC } from 'react'
import { DiagnosticRate, DiagnosticType } from '../../constants/enums'
import { useTranslation } from 'react-i18next'

export interface DiagnosticSummaryCardProps {
  type: DiagnosticType
  rate: DiagnosticRate
}

const DiagnosticSummaryCard: FC<DiagnosticSummaryCardProps> = ({ type, rate }) => {
  const { t } = useTranslation()

  const rateColor =
    rate === DiagnosticRate.POOR
      ? 'text-error'
      : rate === DiagnosticRate.FAIR
      ? 'text-warning'
      : 'text-success'

  return (
    <div className='bg-dark25 flex flex-col justify-between h-full p-4 w-full md:w-40 border border-dark400'>
      <div className='flex justify-between'>
        <Typography
          isBold
          family='font-archivo'
          type='text-caption1'
          className='uppercase'
          color='text-dark900'
        >
          {t(type.toLowerCase())} <br /> {t('diagnostic')}
        </Typography>
        <i className='bi-question-circle-fill text-dark300' />
      </div>
      <Typography
        type='text-tiny'
        isBold
        isUpperCase
        family='font-archivo'
        color={rateColor}
        className='uppercase'
      >
        {t(rate.toLowerCase())}
      </Typography>
    </div>
  )
}

export default DiagnosticSummaryCard
