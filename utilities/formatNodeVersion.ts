const formatNodeVersion = (data: string) => {
  const version = data.split('/')[1]
  const split = version.split('-')

  return {
    version: split[0],
    id: split[1],
  }
}

export default formatNodeVersion
