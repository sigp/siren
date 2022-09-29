const getTimeRemaining = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor(time / 60) % 60
  const seconds = time % 60

  return {
    hours,
    minutes,
    seconds,
  }
}

export default getTimeRemaining
