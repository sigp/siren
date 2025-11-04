import { FC } from 'react'
import formatNodeVersion from '../../../utilities/formatNodeVersion'
import { NodeVersion } from '../../types'
import Typography from '../Typography/Typography'

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
  bnVersion: string
  vcVersion: string
}

const AppVersion: FC<AppVersionProps> = ({ className, vcVersion, bnVersion }) => {
  const validatorVersion = formatNodeVersion(vcVersion)
  const beaconVersion = formatNodeVersion(bnVersion)

  return (
    <div className={className}>
      <Typography
        type='text-caption1'
        color='text-dark400'
        darkMode='dark:text-dark300'
        className='mb-1'
      >
        Beacon Node — {beaconVersion && <VersionText data={beaconVersion} />}
      </Typography>
      <Typography type='text-caption1' color='text-dark400' darkMode='dark:text-dark300'>
        Validator Client — {vcVersion && <VersionText data={validatorVersion} />}
      </Typography>
    </div>
  )
}

export default AppVersion
