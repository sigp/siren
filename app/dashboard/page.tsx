import '../../src/global.css'
import { redirect } from 'next/navigation'
import getSessionCookie from '../../utilities/getSessionCookie'
import { fetchActivities } from '../api/activities'
import {
  fetchBeaconSpec,
  fetchInclusionRate,
  fetchNodeHealth,
  fetchPeerData,
  fetchProposerDuties,
  fetchSyncData,
} from '../api/beacon'
import { fetchBeaconNodeVersion, fetchGenesisData, fetchValidatorVersion } from '../api/config'
import { fetchLogMetrics } from '../api/logs'
import { fetchValCaches, fetchValStates } from '../api/validator'
import Wrapper from './Wrapper'

export default async function Page() {
  try {
    const token = getSessionCookie()

    const beaconSpec = await fetchBeaconSpec(token)
    const genesisBlock = await fetchGenesisData(token)
    const peerData = await fetchPeerData(token)
    const syncData = await fetchSyncData(token)
    const nodeHealth = await fetchNodeHealth(token)
    const states = await fetchValStates(token)
    const caches = await fetchValCaches(token)
    const inclusion = await fetchInclusionRate(token)
    const bnVersion = await fetchBeaconNodeVersion(token)
    const lighthouseVersion = await fetchValidatorVersion(token)
    const proposerDuties = await fetchProposerDuties(token)
    const logMetrics = await fetchLogMetrics(token)
    const activities = await fetchActivities({ token })

    return (
      <Wrapper
        initActivityData={activities}
        initProposerDuties={proposerDuties}
        initValCaches={caches}
        initValStates={states}
        initNodeHealth={nodeHealth}
        initSyncData={syncData}
        initInclusionRate={inclusion}
        initPeerData={peerData}
        initLogMetrics={logMetrics}
        genesisTime={genesisBlock}
        lighthouseVersion={lighthouseVersion.version}
        bnVersion={bnVersion.version}
        beaconSpec={beaconSpec}
      />
    )
  } catch (e) {
    redirect('/error')
  }
}
