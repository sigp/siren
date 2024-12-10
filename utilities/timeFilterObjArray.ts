import moment, { unitOfTime } from 'moment/moment'

const timeFilterObjArray = (array: any[], field: string, unit: unitOfTime.Diff, time: number) => {
  try {
    return array.filter((item) => {
      const logDate = moment(item[field])
      const now = moment()

      return now.diff(logDate, unit) <= time
    })
  } catch (e) {
    return array
  }
}

export default timeFilterObjArray
