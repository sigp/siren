import { BACKEND_URL } from '../../src/constants/envars'
import { LogType } from '../../src/types'
import fetchFromApi from '../../utilities/fetchFromApi'

export interface fetchLogDataProps {
  token: string
  type?: LogType | undefined
  limit?: string | undefined
  offset?: string | undefined
  level?: string | undefined
}

export interface searchLogDataProps {
  token: string
  type?: LogType | undefined
  search?: string | undefined
}

export interface fetchPriorityProps {
  token: string
  type?: string
  limit?: string
  order?: string
  since?: string
}

export const fetchLogMetrics = async (token: string) =>
  fetchFromApi(`${BACKEND_URL}/logs/metrics`, token)
export const dismissLogAlert = async (token: string, index: string) =>
  fetchFromApi(`${BACKEND_URL}/logs/dismiss/${index}`, token)
export const fetchMetrics = async (token: string, type?: LogType) => {
  const params = new URLSearchParams()

  if (type) {
    params.append('type', type)
  }
  return await fetchFromApi(`${BACKEND_URL}/logs/log-metrics?${params.toString()}`, token)
}

export const fetchPriorityLogs = async (props: fetchPriorityProps) => {
  const { token, type, limit, order, since } = props
  const params = new URLSearchParams()

  if (type) params.append('type', type)
  if (limit) params.append('limit', limit)
  if (order) params.append('order', order)
  if (since) params.append('since', since)

  return await fetchFromApi(`${BACKEND_URL}/logs/priority-logs?${params.toString()}`, token)
}

export const fetchLogData = async (props: fetchLogDataProps) => {
  const { token, offset, limit, type, level } = props || {}
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  if (offset) params.append('offset', offset)
  if (limit) params.append('limit', limit)
  if (level) params.append('level', level)

  return await fetchFromApi(`${BACKEND_URL}/logs/history?${params.toString()}`, token)
}

export const searchLogData = async (props: searchLogDataProps) => {
  const { token, search, type } = props || {}
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  if (search) params.append('search', search)

  return await fetchFromApi(`${BACKEND_URL}/logs/search?${params.toString()}`, token)
}
