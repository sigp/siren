import moment from 'moment'

const getSlotTimeData = (slot: number, genesis: number, secondsPerSlot: number) => {
  const today = moment()
  const dutyTime = moment((genesis + slot * secondsPerSlot) * 1000)
  const isFuture = today.diff(dutyTime) < 0

  return {
    time: dutyTime,
    shortHand: dutyTime.fromNow(),
    isFuture,
  }
}

export default getSlotTimeData
