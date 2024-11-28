import { LogLevels, LogType } from '../types'

const fixedDate = new Date('1991-02-21T00:00:00Z')

export const mockWarningLog = {
  id: 1,
  level: LogLevels.WARN,
  data: 'fake-warning',
  type: LogType.BEACON,
  isHidden: false,
  createdAt: fixedDate,
  updatedAt: fixedDate,
}
export const mockErrorLog = {
  id: 2,
  level: LogLevels.ERRO,
  data: 'fake-error',
  type: LogType.BEACON,
  isHidden: false,
  createdAt: fixedDate,
  updatedAt: fixedDate,
}
export const mockCritLog = {
  id: 3,
  level: LogLevels.CRIT,
  data: 'fake-crit',
  type: LogType.VALIDATOR,
  isHidden: false,
  createdAt: fixedDate,
  updatedAt: fixedDate,
}
