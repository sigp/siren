import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '../../Typography/Typography'
import WithdrawalAddressText from "../../WithdrawalAddress/WithdrawalAddressText";
import { TableProps } from '../ValidatorDetailTable'

const DesktopDetailView: FC<TableProps> = ({
  balance,
  income,
  incomeColor,
  withdrawalAddress,
  estimatedApr,
  aprColor,
}) => {
  const { t } = useTranslation()
  const headers = [
    t('balance'),
    t('income'),
    t('proposed'),
    t('attested'),
    t('aggregated'),
    t('withdrawalAddress'),
    'Apr',
  ]

  const getWidthClass = (idx: number): string => {
    switch (idx) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return 'w-20 @1600:w-28'
      case 5:
        return 'w-44'
      case 6:
        return 'p-4'
      default:
        return 'flex-1'
    }
  }

  return (
    <div className='hidden lg:block border-t-style100 w-full'>
      <div className='w-full flex'>
        {headers.map((header, idx) => (
          <div key={idx} className={`${getWidthClass(idx)} py-4 px-6`}>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {header}
            </Typography>
          </div>
        ))}
      </div>
      <div className='border-t-style100 w-full flex'>
        <div className='w-20 @1600:w-28 py-4 px-6'>
          <Typography type='text-caption1'>
            {balance !== undefined ? balance.toFixed(4) : '-'}
          </Typography>
        </div>
        <div className='w-20 @1600:w-28 py-4 px-6'>
          <Typography type='text-caption1' color={incomeColor} darkMode={incomeColor}>
            {income.toFixed(4)}
          </Typography>
        </div>
        {['proposed', 'attested', 'aggregated'].map((_, idx) => (
          <div key={idx} className='w-20 @1600:w-28 py-4 px-6 opacity-40'>
            <Typography color='text-darkFull' darkMode='dark:text-dark400' type='text-caption1'>
              -
            </Typography>
          </div>
        ))}
        <div className='w-44 py-4 px-6'>
          <WithdrawalAddressText color='text-darkFull' darkMode='dark:text-dark400' type='text-caption1' withdrawalAddress={withdrawalAddress} id="withdrawal-address"/>
        </div>
        <div className='p-4'>
          <Typography darkMode={`dark:${aprColor}`} color={aprColor} type='text-caption1'>
            {`${estimatedApr ? estimatedApr.toFixed(2) : '---'} %`}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default DesktopDetailView
