import formatNodeVersion from './formatNodeVersion'
import formatSemanticVersion from './formatSemanticVersion'
import { SemanticVersion } from '../types'

const isRequiredVersion = (version: string, semanticVersion: SemanticVersion) => {
  const nodeVersion = formatNodeVersion(version)
  const { major, minor } = formatSemanticVersion(nodeVersion.version) as SemanticVersion

  return (
    major > semanticVersion.major ||
    (major === semanticVersion.major && minor >= semanticVersion.minor)
  )
}

export default isRequiredVersion
