const groupArray = (arr: any[], size: number) => {
  return arr.length < size
    ? arr
    : Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, (i + 1) * size),
      )
}

export default groupArray
