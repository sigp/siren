import { BACKEND_URL } from '../../src/constants/envars'
import fetchFromApi from '../../utilities/fetchFromApi'

export interface fetchActivitiesProps {
  token: string
  offset?: string
  limit?: string
  order?: string
  since?: string
}

export const fetchActivities = async (props: fetchActivitiesProps) => {
  const { token, offset, limit, order, since } = props
  const params = new URLSearchParams()

  if (offset) params.append('offset', offset)
  if (limit) params.append('limit', limit)
  if (order) params.append('order', order)
  if (since) params.append('since', since)

  return await fetchFromApi(`${BACKEND_URL}/activity?${params.toString()}`, token)
}

export const logActivity = async (data: any, token: string) =>
  await fetchFromApi(`${BACKEND_URL}/activity`, token, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const readActivity = async (id: string, token: string) =>
  await fetchFromApi(`${BACKEND_URL}/activity/${id}/read`, token, {
    method: 'PUT',
  })
