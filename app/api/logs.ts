import { BACKEND_URL } from '../../src/constants/envars'
import { LogType } from '../../src/types'
import fetchFromApi from '../../utilities/fetchFromApi'

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

export interface fetchPriorityProps {
  token: string
  type?: string
  limit?: string
  order?: string
  since?: string
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
