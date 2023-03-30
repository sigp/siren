const calculateAprPercentage = (currentTotal: number, startingTotal: number) =>
  (currentTotal / startingTotal - 1) * 100

export default calculateAprPercentage
