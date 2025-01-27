import fetchFromApi from '../../utilities/fetchFromApi'

const backendUrl = process.env.BACKEND_URL
export const fetchLogMetrics = async (token: string) =>
  fetchFromApi(`${backendUrl}/logs/metrics`, token)
export const dismissLogAlert = async (token: string, index: string) =>
  fetchFromApi(`${backendUrl}/logs/dismiss/${index}`, token)
export const fetchMetrics = async (token: string) =>
  fetchFromApi(`${backendUrl}/logs/log-metrics`, token)

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

  return await fetchFromApi(`${backendUrl}/logs/priority-logs?${params.toString()}`, token)
}
