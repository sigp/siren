const getWordLength = (value: string | undefined): number => {
  return value ? value.trim().split(' ').length : 0
}

export default getWordLength