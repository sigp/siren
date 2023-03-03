import { useRecoilValue } from 'recoil'
import { selectBnChain } from '../../recoil/selectors/selectBnChain'
import PillIcon from '../PillIcon/PillIcon'

const BeaconNetwork = () => {
  const bnNetwork = useRecoilValue(selectBnChain)

  return bnNetwork ? (
    <PillIcon bgColor='bg-dark200' bgDark='dark:bg-dark600' text={bnNetwork.toUpperCase()} />
  ) : null
}

export default BeaconNetwork
