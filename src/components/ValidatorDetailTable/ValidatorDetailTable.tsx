import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import formatBalanceColor from '../../../utilities/formatBalanceColor'
import useEpochAprEstimate from '../../hooks/useEpochAprEstimate'
import { ValidatorCache, ValidatorInfo } from '../../types/validator'
import Typography from '../Typography/Typography'

export interface ValidatorDetailTableProps {
  validator: ValidatorInfo
  validatorCacheData: ValidatorCache
}

export const ValidatorDetailTable: FC<ValidatorDetailTableProps> = ({
  validator,
  validatorCacheData,
}) => {
  const { t } = useTranslation()
  const { balance, index } = validator
  const income = balance ? balance - 32 : 0
  const incomeColor = formatBalanceColor(income)
  const { estimatedApr, textColor } = useEpochAprEstimate(validatorCacheData, [String(index)])
  return (
    <>
      <div className='w-full lg:hidden'>
        <div className='border-t-style100 w-full'>
          <div className='w-full flex'>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('balance')}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('income')}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('proposed')}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('attested')}
              </Typography>
            </div>
          </div>
          <div className='border-t-style100 w-full flex'>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>{balance?.toFixed(4)}</Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1' color={income > 0 ? 'text-success' : 'text-error'}>
                {income.toFixed(4)}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>-</Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>-</Typography>
            </div>
          </div>
        </div>
        <div className='border-t-style100 w-full'>
          <div className='w-full flex'>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('aggregated')}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('in')}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                {t('effectiveness')}
              </Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
                Apr
              </Typography>
            </div>
          </div>
          <div className='border-t-style100 w-full flex'>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>-</Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>-</Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>-</Typography>
            </div>
            <div className='flex-1 py-2 px-2 md:py-4 md:px-6'>
              <Typography type='text-caption1'>-</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className='hidden lg:block border-t-style100 w-full'>
        <div className='w-full flex'>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('balance')}
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('income')}
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('proposed')}
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('attested')}
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('aggregated')}
            </Typography>
          </div>
          <div className='w-12 @1600:w-20 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('in')}
            </Typography>
          </div>
          <div className='w-24 @1600:w-32 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              {t('effectiveness')}
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption2' color='text-dark500' isBold isUpperCase>
              Apr
            </Typography>
          </div>
        </div>
        <div className='border-t-style100 w-full flex'>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption1'>{balance?.toFixed(4)}</Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6'>
            <Typography type='text-caption1' color={incomeColor} darkMode={incomeColor}>
              {income.toFixed(4)}
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6 opacity-40'>
            <Typography color='text-darkFull' darkMode="dark:text-dark400" type='text-caption1'>
              -
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6 opacity-40'>
            <Typography color='text-darkFull' darkMode="dark:text-dark400" type='text-caption1'>
              -
            </Typography>
          </div>
          <div className='w-20 @1600:w-28 py-4 px-6 opacity-40'>
            <Typography color='text-darkFull' darkMode="dark:text-dark400" type='text-caption1'>
              -
            </Typography>
          </div>
          <div className='w-12 @1600:w-20 py-4 px-6 opacity-40'>
            <Typography color='text-darkFull' darkMode="dark:text-dark400" type='text-caption1'>
              -
            </Typography>
          </div>
          <div className='w-24 @1600:w-32 py-4 px-6 opacity-40'>
            <Typography color='text-darkFull' darkMode="dark:text-dark400" type='text-caption1'>
              -
            </Typography>
          </div>
          <div className='py-4 px-6'>
            <Typography darkMode={`dark:${textColor}`} color={textColor} type='text-caption1'>
              {`${estimatedApr ? estimatedApr.toFixed(2) : '---'} %`}
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}

export default ValidatorDetailTable
