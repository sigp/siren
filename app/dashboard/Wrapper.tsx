'use client'

import React, { FC } from 'react'
import SharedDataCachePrimer from '../../src/components/SharedDataCachePrimer'
import Main, { MainProps } from './Main'

const Wrapper: FC<MainProps> = (props) => {
  return (
    <>
      {/* Prime SWR cache with initial data for instant page navigation */}
      <SharedDataCachePrimer
        beaconSpec={props.beaconSpec}
        syncData={props.initSyncData}
        nodeHealth={props.initNodeHealth}
        activities={props.initActivityData}
        exclusions={props.initExclusionData}
        beaconVersion={{ version: props.bnVersion }}
        validatorVersion={{ version: props.lighthouseVersion }}
      />
      <Main {...props} />
    </>
  )
}

export default Wrapper
