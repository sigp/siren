import { useRecoilValue } from 'recoil'
import { selectBnChain } from '../../recoil/selectors/selectBnChain'
import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'

const BeaconNetwork = () => {
  const { t } = useTranslation()
  const bnNetwork = useRecoilValue(selectBnChain)

  return bnNetwork ? (
    <div
      data-testid='beaconNetwork'
      className='flex flex-col h-full py-1.5 pl-2 pr-4 justify-between border-l border-r border-borderLight dark:border-borderDark'
    >
      <Typography type='text-tiny' darkMode='dark:text-white' isUpperCase isBold>
        {t('network')}
      </Typography>
      <Typography
        type='text-tiny'
        family='font-roboto'
        color='text-primary'
        darkMode='dark:text-primary'
        isUpperCase
        isBold
      >
        {bnNetwork}
      </Typography>
    </div>
  ) : null
}

export default BeaconNetwork
