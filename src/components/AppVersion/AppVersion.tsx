import { useRecoilValue } from 'recoil'
import { selectValidatorVersion } from '../../recoil/selectors/selectValidatorVersion'
import { selectBeaconVersion } from '../../recoil/selectors/selectBeaconVersion'
import Typography from '../Typography/Typography'
import { NodeVersion } from '../../types'
import { FC } from 'react'

interface VersionTextProps {
  data: NodeVersion
}

const VersionText: FC<VersionTextProps> = ({ data: { version, id } }) => (
  <>
    <span className='text-primary font-bold uppercase'>{version}</span>-<span>{id}</span>
  </>
)

export interface AppVersionProps {
  className?: string
}

const AppVersion: FC<AppVersionProps> = ({ className }) => {
  const vcVersion = useRecoilValue(selectValidatorVersion)
  const beaconVersion = useRecoilValue(selectBeaconVersion)

  return (
    <div className={className}>
      <Typography type='text-tiny' color='text-dark400'>
        Beacon — {beaconVersion && <VersionText data={beaconVersion} />}
      </Typography>
      <Typography type='text-tiny' color='text-dark400'>
        Validator — {vcVersion && <VersionText data={vcVersion} />}
      </Typography>
    </div>
  )
}

export default AppVersion
