import { NextFetchRequestInit } from '../src/types'

const fetchFromApi = async (url: string, token: string, options?: NextFetchRequestInit) => {
  const defaultOptions: RequestInit = {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const finalOptions: RequestInit = { ...defaultOptions, ...options }

  try {
    const response = await fetch(url, finalOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (e) {
    throw e
  }
}

export default fetchFromApi
