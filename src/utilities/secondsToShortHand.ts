import getTimeRemaining from './getTimeRemaining'

const secondsToShortHand = (seconds: number) => {
  const time = getTimeRemaining(seconds)

  if (Object.values(time).reduce((a, b) => a + b, 0) === 0) {
    return '0M 0S'
  }

  if (time.days > 0) {
    return `${time.days}D ${time.hours}H`
  }

  if (time.hours > 0) {
    return `${time.hours}H ${time.minutes}M`
  }

  return `${time.minutes}M ${time.seconds}S`
}

export default secondsToShortHand
