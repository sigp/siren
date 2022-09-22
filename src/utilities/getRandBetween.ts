const getRandBetween = (min: number, max: number, isFloor?: boolean) => {
  const value = Number((min + Math.random() * (max - min + 1)).toFixed(2))
  return isFloor ? Math.floor(value) : value
}

export default getRandBetween
