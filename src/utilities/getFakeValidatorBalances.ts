import moment from 'moment'
import { FAKE_VALIDATORS } from '../constants/constants'
import getRandBetween from './getRandBetween'

const getFakeValidatorBalances = () => {
  const now = moment()

  const labels = Array.from(Array(10).keys())
  const slots = labels.map(() => now.subtract(10, 's').format('hh:ss'))

  const data = FAKE_VALIDATORS.map(() => {
    let startEth = getRandBetween(32, 69)

    return slots.map(() => {
      const newValue = Number((startEth + getRandBetween(0.05, 1)).toFixed(2))
      startEth = newValue

      return newValue
    })
  })

  return {
    slots,
    data,
  }
}

export default getFakeValidatorBalances
