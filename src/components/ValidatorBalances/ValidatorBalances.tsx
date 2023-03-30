import StepChart from '../StepChart/StepChart'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import useValidatorEpochBalance from '../../hooks/useValidatorEpochBalance'
import { useEffect, useMemo, useState } from 'react'
import Spinner from '../Spinner/Spinner'
import LoadingDots from '../LoadingDots/LoadingDots'
import useUiMode from '../../hooks/useUiMode'
import CheckBox from '../CheckBox/CheckBox'
import useLocalStorage from '../../hooks/useLocalStorage'
import { ValidatorIndicesStorage } from '../../types/storage'
import RodalModal from '../RodalModal/RodalModal'
import useMediaQuery from '../../hooks/useMediaQuery'

export const ValidatorBalanceFallback = () => (
  <div className='flex-1 flex h-24 w-full justify-center items-center'>
    <Spinner />
  </div>
)

const ValidatorBalances = () => {
  const { t } = useTranslation()
  const { mode } = useUiMode()
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [hiddenValidators, setHiddenValidators] = useState<string[]>([])
  const [isLegendModal, toggleModal] = useState(false)
  const { epochs, timestamps, isSufficientData } = useValidatorEpochBalance()
  const [hiddenIndices, storeHiddenValidators] = useLocalStorage<ValidatorIndicesStorage>(
    'hiddenValidatorIndices',
    undefined,
  )

  useEffect(() => {
    const persistedValidators = hiddenIndices && JSON.parse(hiddenIndices)
    if (!hiddenValidators.length && persistedValidators?.length) {
      setHiddenValidators(persistedValidators)
    }
  }, [hiddenIndices, hiddenValidators])

  const balanceData = useMemo(() => {
    return {
      labels: timestamps,
      datasets: epochs
        .filter(({ index }) => !hiddenValidators.includes(index))
        .map(({ name, data, color }) => {
          return {
            label: name as string,
            data,
            borderColor: color,
            backgroundColor: color,
            fill: true,
            pointRadius: 0,
            stepped: 'after',
          }
        }),
    }
  }, [epochs, timestamps, hiddenValidators])

  const stepSize = useMemo(() => {
    const data = balanceData.datasets
      .map((data) => data.data)
      .flat()
      .sort()
    return balanceData.datasets.length ? (data[data.length - 1] - data[0]) / 8 : 0
  }, [balanceData])

  const onClose = () => toggleModal(false)
  const toggleValidator = (index: string) => {
    const indices = hiddenValidators.includes(index)
      ? hiddenValidators.filter((prevIndex) => prevIndex !== index)
      : [...hiddenValidators, index]

    setHiddenValidators(indices)
    storeHiddenValidators(JSON.stringify(indices))
  }

  const viewBalanceLegend = () => toggleModal(true)

  return (
    <div className='flex-1 flex h-full w-full'>
      <div className='p-1 h-full hidden md:flex items-center justify-center'>
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
      <div className='relative flex-1 flex flex-col pb-2 items-center justify-center'>
        <div className='pl-1 pr-4 mb-2 z-10 top-0 left-0 w-full flex justify-between'>
          <Typography color='text-primary' darkMode='dark:text-white'>
            {t('validatorBalance')}
          </Typography>
          <Typography color='text-primary' darkMode='dark:text-white'>
            {balanceData.datasets.length}
          </Typography>
        </div>
        <RodalModal
          styles={{
            backgroundColor: mode === 'DARK' ? '#1E1E1E' : 'white',
            width: isTablet ? '100%' : '400px',
            height: '240px',
            overflow: 'hidden',
          }}
          onClose={onClose}
          isVisible={isLegendModal}
        >
          <div className='w-full h-full flex flex-col'>
            <div className='w-full p-4 border-b-style500'>
              <Typography isBold>{t('validatorLegend')}</Typography>
            </div>
            <ul className='w-full flex-1 overflow-scroll'>
              {epochs.map(({ name, index, color }, key) => (
                <li
                  onClick={() => toggleValidator(index)}
                  className='cursor-pointer p-3 flex justify-between even:bg-dark10 dark:even:bg-dark750'
                  key={key}
                >
                  <div className='flex items-center space-x-2'>
                    <div className='w-3 h-3 border-black' style={{ backgroundColor: color }} />
                    <Typography type='text-caption1'>
                      {index}. <span className='font-bold ml-4'>{name}</span>
                    </Typography>
                  </div>
                  <CheckBox
                    onChange={() => toggleValidator(index)}
                    checked={!hiddenValidators.includes(index)}
                    id={index}
                  />
                </li>
              ))}
            </ul>
          </div>
        </RodalModal>
        {isSufficientData ? (
          <StepChart
            onClick={viewBalanceLegend}
            className='cursor-pointer'
            stepSize={stepSize}
            data={balanceData}
          />
        ) : epochs.length ? (
          <div className='w-full h-full flex flex-col items-center justify-center'>
            <Typography color='text-primary' type='text-caption1' darkMode='dark:text-white'>
              {t('nodesCachingData')}
            </Typography>
            <Typography color='text-primary' type='text-caption1' darkMode='dark:text-white'>
              {t('thisCouldTakeTime')}
            </Typography>
            <LoadingDots className='mt-4' />
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
