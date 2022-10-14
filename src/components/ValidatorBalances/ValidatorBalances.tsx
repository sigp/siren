import { BALANCE_COLORS, initialEthDeposit, secondsInEpoch } from '../../constants/constants';
import getAverageValue from '../../utilities/getAverageValue'
import StepChart from '../StepChart/StepChart'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectValidatorEpochs } from '../../recoil/selectors/selectValidatorEpochs'
import moment from 'moment/moment'

const ValidatorBalances = () => {
  const { t } = useTranslation()
  const validatorEpochs = useRecoilValue(selectValidatorEpochs)

  const labels = Array.from(Array(10).keys())
    .map((_, i) =>
      moment()
        .subtract(secondsInEpoch * i, 's')
        .format('hh:mm'),
    )
    .reverse()

  const validators = validatorEpochs
    .map(({ name, data }) => {
      if (data.length < labels.length) {
        const missingEpochs = labels.length - data.length

        const fillData = Array.from(Array(missingEpochs).keys()).map(() => initialEthDeposit)

        data = [...fillData, ...data]
      }

      return {
        label: name,
        data,
        fill: true,
        pointRadius: 0,
        stepped: 'after',
      }
    })
    .sort((a, b) => getAverageValue(a.data) - getAverageValue(b.data))

  const datasets = validators.map((data, index) => ({
    ...data,
    borderColor: BALANCE_COLORS[index],
    backgroundColor: BALANCE_COLORS[index],
  }))

  const balanceData = {
    labels,
    datasets,
  }

  return (
    <div className='flex-1 flex h-24 w-full'>
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
      <div className='relative flex-1'>
        <div className='px-8 absolute z-10 top-0 left-0 w-full flex justify-between'>
          <Typography color='text-primary' darkMode='dark:text-white'>
            {t('validatorBalance')}
          </Typography>
          <Typography color='text-primary' darkMode='dark:text-white'>
            {validators.length}
          </Typography>
        </div>
        <StepChart data={balanceData} />
      </div>
    </div>
  )
}

export default ValidatorBalances
