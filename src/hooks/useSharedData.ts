/**
 * Shared data hooks for common data used across multiple pages.
 * These hooks use SWR's global cache, enabling instant page navigation
 * by reading from cached data with periodic background updates.
 */

import useSWR from 'swr'
import type { ActivityResponse, ExcludedStatus } from '../types'
import type { BeaconNodeSpecResults, SyncData } from '../types/beacon'
import type { Diagnostics } from '../types/diagnostic'
import useSWRPolling from './useSWRPolling'

/**
 * Beacon chain specification (static for entire session).
 * NOTE: BeaconSpec is fetched server-side and passed as fallbackData
 * There is no /api/beacon-spec route - we use cache-only mode
 * No fetcher, no revalidation - purely reading from cache
 */
export const useBeaconSpec = (fallbackData?: BeaconNodeSpecResults) => {
  // Beacon spec has no API route - use SWR in cache-only mode
  // Pass null as fetcher to prevent any fetch attempts
  return useSWR<BeaconNodeSpecResults>('beacon-spec-cached', null, {
    fallbackData,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
  })
}

/**
 * Beacon node version (static for entire session).
 * Cached infinitely in backend - fetch once and cache forever in frontend.
 * Will fetch on first mount if cache is empty, then cache forever.
 */
export const useBeaconVersion = () => {
  return useSWRPolling<{ version: string }>('/api/beacon-version', {
    refreshInterval: 0, // Never refetch after initial fetch
    errorRetryCount: 2,
  })
}

/**
 * Validator client version (static for entire session).
 * Cached infinitely in backend - fetch once and cache forever in frontend.
 * Will fetch on first mount if cache is empty, then cache forever.
 */
export const useValidatorVersion = () => {
  return useSWRPolling<{ version: string }>('/api/lighthouse-version', {
    refreshInterval: 0, // Never refetch after initial fetch
    errorRetryCount: 2,
  })
}

/**
 * Beacon node sync status.
 * Used in TopBar to display sync progress.
 * Polling interval: Based on SECONDS_PER_SLOT (typically 12s)
 */
export const useSyncData = (
  refreshInterval: number,
  fallbackData?: SyncData,
  networkError?: boolean,
) => {
  return useSWRPolling<SyncData>('/api/node-sync', {
    refreshInterval,
    fallbackData,
    errorRetryCount: 2,
    networkError,
  })
}

/**
 * Node health diagnostics.
 * Used in FootBar to display node health status.
 * Polling interval: 12 seconds (balanced between responsiveness and efficiency)
 */
export const useNodeHealth = (fallbackData?: Diagnostics, networkError?: boolean) => {
  return useSWRPolling<Diagnostics>('/api/node-health', {
    refreshInterval: 12000, // 12 seconds
    fallbackData,
    errorRetryCount: 2,
    networkError,
  })
}

/**
 * Activity history data.
 * Used in ActivityHistory component in TopBar.
 * Polling interval: 15 seconds (activities don't change rapidly)
 */
export const useActivities = (fallbackData?: ActivityResponse) => {
  return useSWRPolling<ActivityResponse>('/api/activity', {
    refreshInterval: 15000, // 15 seconds
    fallbackData,
    errorRetryCount: 2,
  })
}

/**
 * Validator status exclusion list.
 * Used for filtering validators by status.
 * Polling interval: 30 seconds (user preferences don't change often)
 */
export const useValidatorExclusionList = (fallbackData?: ExcludedStatus[]) => {
  return useSWRPolling<ExcludedStatus[]>('/api/exclusions', {
    refreshInterval: 30000, // 30 seconds
    fallbackData,
    errorRetryCount: 2,
  })
}
