import { useRecoilValue } from 'recoil'
import { selectBnChain } from '../../recoil/selectors/selectBnChain'
import Typography from '../Typography/Typography'

const BeaconNetwork = () => {
  const bnNetwork = useRecoilValue(selectBnChain)

  return bnNetwork ? (
    <div className='flex flex-col h-full py-1.5 pl-2 pr-4 justify-between border-l border-r border-borderLight dark:border-borderDark'>
      <Typography type='text-tiny' darkMode='dark:text-white' isUpperCase isBold>
        Network
      </Typography>
      <div>
        <Typography type='text-tiny' family='font-roboto' color='text-dark400'>
          ---
        </Typography>
        <Typography type='text-tiny' family='font-roboto' color='text-dark400' isUpperCase isBold>
          {bnNetwork}
        </Typography>
      </div>
    </div>
  ) : null
}

export default BeaconNetwork
