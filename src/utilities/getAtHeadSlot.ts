import moment from 'moment/moment'

const getAtHeadSlot = (genesis?: number, headSlot?: number) => {
  if (!genesis || !headSlot) return

  return headSlot - Math.floor((moment().unix() - (genesis + 6)) / 12)
}

export default getAtHeadSlot
