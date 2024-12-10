import moment from 'moment'

const getSlotTimeData = (head: number, slot: number, secondsPerSlot: number) => {
  const distance = (slot - head) * secondsPerSlot

  let now = moment()
  let time = moment().add(distance, 'seconds')
  const isFuture = now.diff(time) < 0

  return {
    time,
    shortHand: time.fromNow(),
    isFuture,
  }
}

export default getSlotTimeData
