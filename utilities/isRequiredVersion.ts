import formatNodeVersion from './formatNodeVersion'
import formatSemanticVersion from './formatSemanticVersion'
import { SemanticVersion } from '../src/types'

const isRequiredVersion = (version: string, requiredVersion: SemanticVersion) => {
  const nodeVersion = formatNodeVersion(version)
  const { major, minor } = formatSemanticVersion(nodeVersion.version) as SemanticVersion

  return (
    major > requiredVersion.major ||
    (major === requiredVersion.major && minor >= requiredVersion.minor)
  )
}

export default isRequiredVersion
