import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { selectBnChain } from '../../recoil/selectors/selectBnChain'
import Typography from '../Typography/Typography'

const BeaconNetwork = () => {
  const { t } = useTranslation()
  const bnNetwork = useRecoilValue(selectBnChain)

  return (
    <div
      data-testid='beaconNetwork'
      className='flex flex-col h-full py-1.5 pl-2 pr-4 justify-between border-l border-r border-borderLight dark:border-borderDark'
    >
      <Typography
        type='text-tiny'
        darkMode='dark:text-white'
        isUpperCase
        isBold
        className='@1600:text-caption1'
      >
        {t('network')}
      </Typography>
      <Typography
        type='text-tiny'
        family='font-roboto'
        color='text-primary'
        darkMode='dark:text-primary'
        isUpperCase
        isBold
        className='@1600:text-caption1'
      >
        {bnNetwork || '-'}
      </Typography>
    </div>
  )
}

export default BeaconNetwork
