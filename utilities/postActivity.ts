import axios from 'axios'
import { ActivityType } from '../src/types'
import { Status } from '../src/constants/enums'

export interface postActivityOptions {
  data: Record<string, any>
  type: ActivityType
  pubKey: string
  status: Status
}

const postActivity = async ({ data, type, pubKey, status }: postActivityOptions) => {
  return await axios.post('/api/log-activity', {
    data: JSON.stringify(data),
    type,
    pubKey,
    status,
  })
}

export default postActivity
