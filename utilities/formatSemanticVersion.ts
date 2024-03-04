import { SemanticVersion } from '../src/types'

const formatSemanticVersion = (version: string): SemanticVersion | undefined => {
  let vString = version

  if (vString.includes('v')) {
    vString = version.replace('v', '')
  }

  const formattedVersion = vString
    .replace(/[^\d.-]/g, '')
    .split('.')
    .map((i) => parseInt(i))

  if (formattedVersion.length !== 3) return

  return {
    major: formattedVersion[0],
    minor: formattedVersion[1],
    patch: formattedVersion[2],
  }
}

export default formatSemanticVersion
