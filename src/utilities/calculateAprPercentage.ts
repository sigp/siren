const calculateAprPercentage = (currentTotal: number, startingTotal: number) =>
  (Math.pow(currentTotal / startingTotal, 1) - 1) * 100

export default calculateAprPercentage
