import { secondsInDay } from '../src/constants/constants'
import moment from 'moment/moment'

const formatMoment = (seconds: number, isPast = false) => {
  const format = seconds > secondsInDay ? 'd [day] h [hour]' : 'h [hour] m [minute]'
  const time = moment.duration(seconds, 'seconds').format(format, { trim: 'both' })
  return isPast ? `${time} ago` : `in ${time}`
}

export default formatMoment
