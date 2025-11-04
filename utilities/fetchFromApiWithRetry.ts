import { NextFetchRequestInit } from '../src/types'

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  timeout?: number
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetches from an API endpoint with automatic retry logic and exponential backoff.
 * Useful for handling network reconnection scenarios gracefully.
 *
 * @param url - The API endpoint URL
 * @param token - Authorization token
 * @param options - Fetch options
 * @param retryOptions - Retry configuration
 * @returns Promise with the JSON response
 */
const fetchFromApiWithRetry = async (
  url: string,
  token: string,
  options?: NextFetchRequestInit,
  retryOptions: RetryOptions = {},
) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    timeout = 10000,
  } = retryOptions

  const defaultOptions: RequestInit = {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const finalOptions: RequestInit = { ...defaultOptions, ...options }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...finalOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (e: any) {
      lastError = e

      // Don't retry on abort errors if it's the last attempt
      if (attempt === maxRetries) {
        console.error(
          `Failed to fetch ${url} after ${maxRetries + 1} attempts:`,
          e.message || e,
        )
        throw e
      }

      // Calculate exponential backoff delay
      const backoffDelay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)
      console.warn(
        `Fetch attempt ${attempt + 1} failed for ${url}. Retrying in ${backoffDelay}ms...`,
      )

      await delay(backoffDelay)
    }
  }

  throw lastError || new Error('Failed to fetch from API')
}

export default fetchFromApiWithRetry
