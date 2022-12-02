const getTimeRemaining = (
  time: number,
): { days: number; hours: number; minutes: number; seconds: number } => {
  const days = Math.floor(time / (3600 * 24))
  const hours = Math.floor((time % (3600 * 24)) / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export default getTimeRemaining
