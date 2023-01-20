import { BALANCE_COLORS } from '../../constants/constants'
import getAverageValue from '../../utilities/getAverageValue'
import StepChart from '../StepChart/StepChart'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import useValidatorEpochBalance from '../../hooks/useValidatorEpochBalance'
import { useMemo } from 'react'
import Spinner from '../Spinner/Spinner'
import LoadingDots from '../LoadingDots/LoadingDots'

export const ValidatorBalanceFallback = () => (
  <div className='flex-1 flex h-24 w-full justify-center items-center'>
    <Spinner />
  </div>
)

const ValidatorBalances = () => {
  const { t } = useTranslation()
  const { epochs, timestamps, isSufficientData } = useValidatorEpochBalance()

  const balanceData = useMemo(() => {
    return {
      labels: timestamps,
      datasets: epochs
        .map(({ name, data }) => {
          return {
            label: name as string,
            data,
            fill: true,
            pointRadius: 0,
            stepped: 'after',
          }
        })
        .sort((a, b) => getAverageValue(a.data) - getAverageValue(b.data))
        .map((data, index) => ({
          ...data,
          borderColor: BALANCE_COLORS[index],
          backgroundColor: BALANCE_COLORS[index],
        })),
    }
  }, [epochs, timestamps])

  const stepSize = useMemo(() => {
    const data = balanceData.datasets
      .map((data) => data.data)
      .flat()
      .sort()
    return balanceData.datasets.length ? (data[data.length - 1] - data[0]) / 8 : 0
  }, [balanceData])

  return (
    <div className='flex-1 flex h-full w-full'>
      <div className='p-1 h-full flex items-center justify-center'>
        <Typography
          type='text-tiny'
          color='text-primary'
          darkMode='dark:text-white'
          isBold
          className='-rotate-90'
        >
          ETH
        </Typography>
      </div>
      <div className='relative flex-1 flex items-center justify-center'>
        <div className='px-8 absolute z-10 top-0 left-0 w-full flex justify-between'>
          <Typography color='text-primary' darkMode='dark:text-white'>
            {t('validatorBalance')}
          </Typography>
          <Typography color='text-primary' darkMode='dark:text-white'>
            {balanceData.datasets.length}
          </Typography>
        </div>
        {isSufficientData ? (
          <StepChart stepSize={stepSize} data={balanceData} />
        ) : epochs.length ? (
          <div className='w-full h-full flex flex-col items-center justify-center'>
            <Typography color='text-primary' type='text-caption1' darkMode='dark:text-white'>
              {t('nodesCachingData')}
            </Typography>
            <Typography color='text-primary' type='text-caption1' darkMode='dark:text-white'>
              {t('thisCouldTakeTime')}
            </Typography>
            <LoadingDots />
          </div>
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}

export default ValidatorBalances
