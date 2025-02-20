import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '../../Typography/Typography'
import { TableProps } from '../ValidatorDetailTable'

const MobileDetailView: FC<TableProps> = ({ balance, income, withdrawalAddress, estimatedApr }) => {
  const { t } = useTranslation()
  const sectionOneHeaders = [t('balance'), t('income'), t('proposed'), t('attested')]
  const sectionOneValues = [
    balance !== undefined ? balance.toFixed(4) : '-',
    income.toFixed(4),
    '-',
    '-',
  ]
  const sectionTwoHeaders = [t('aggregated'), t('withdrawalAddress'), 'Apr']
  const sectionTwoValues = [
    '-',
    withdrawalAddress || '-',
    `${estimatedApr ? estimatedApr.toFixed(2) : '---'} %`,
  ]

  const renderRow = (headers: string[], values: string[], headerProps = {}) => (
    <>
      <div className='w-full flex'>
        {headers.map((label, idx) => (
          <div key={idx} className='flex-1 py-2 px-2 md:py-4 md:px-6'>
            <Typography
              type='text-caption2'
              color='text-dark500'
              isBold
              isUpperCase
              {...headerProps}
            >
              {label}
            </Typography>
          </div>
        ))}
      </div>
      <div className='border-t-style100 w-full flex'>
        {values.map((val, idx) => (
          <div key={idx} className='flex-1 py-2 px-2 md:py-4 md:px-6'>
            {idx === 1 ? (
              <Typography type='text-caption1' color={income > 0 ? 'text-success' : 'text-error'}>
                {val}
              </Typography>
            ) : (
              <Typography type='text-caption1'>{val}</Typography>
            )}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className='w-full lg:hidden'>
      <div className='border-t-style100 w-full'>
        {renderRow(sectionOneHeaders, sectionOneValues)}
      </div>
      <div className='border-t-style100 w-full'>
        {renderRow(sectionTwoHeaders, sectionTwoValues)}
      </div>
    </div>
  )
}

export default MobileDetailView
