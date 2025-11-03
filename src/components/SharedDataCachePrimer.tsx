'use client'

import { useLayoutEffect, useMemo } from 'react'
import { useSWRConfig } from 'swr'
import type { ActivityResponse } from '../types'
import type { BeaconNodeSpecResults, SyncData } from '../types/beacon'
import type { Diagnostics } from '../types/diagnostic'

/**
 * SharedDataCachePrimer
 *
 * This component "primes" the SWR cache with initial server-fetched data.
 * By populating the cache on the first dashboard load, all subsequent page
 * navigations can read from the cache instantly - even on first visit!
 *
 * Uses useMemo + useLayoutEffect for immediate + persistent cache population.
 */

interface SharedDataCachePrimerProps {
  beaconSpec?: BeaconNodeSpecResults
  syncData?: SyncData
  nodeHealth?: Diagnostics
  activities?: ActivityResponse
  exclusions?: any[]
  beaconVersion?: { version: string }
  validatorVersion?: { version: string }
}

export default function SharedDataCachePrimer({
  beaconSpec,
  syncData,
  nodeHealth,
  activities,
  exclusions,
  beaconVersion,
  validatorVersion,
}: SharedDataCachePrimerProps) {
  const { mutate } = useSWRConfig()

  // Populate cache immediately during render using useMemo
  // This ensures cache is ready BEFORE any child components mount
  useMemo(() => {
    if (beaconSpec) {
      mutate('beacon-spec-cached', beaconSpec, false)
    }
    if (syncData) {
      mutate('/api/node-sync', syncData, false)
    }
    if (nodeHealth) {
      mutate('/api/node-health', nodeHealth, false)
    }
    if (activities) {
      mutate('/api/activity', activities, false)
    }
    if (exclusions) {
      mutate('/api/exclusions', exclusions, false)
    }
    if (beaconVersion) {
      mutate('/api/beacon-version', beaconVersion, false)
    }
    if (validatorVersion) {
      mutate('/api/lighthouse-version', validatorVersion, false)
    }
    return true
  }, [
    beaconSpec,
    syncData,
    nodeHealth,
    activities,
    exclusions,
    beaconVersion,
    validatorVersion,
    mutate,
  ])

  // useLayoutEffect runs after render for any additional side effects
  useLayoutEffect(() => {
    // Cache is already populated by useMemo above
  }, [])

  return null // This component doesn't render anything
}
