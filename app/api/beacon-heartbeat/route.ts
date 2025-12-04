import {type NextRequest, NextResponse} from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchBeaconNodeHeartbeat } from '../config'

const errorMessage = 'Failed to maintain beacon heartbeat'

export async function GET(req: NextRequest) {
  try {
    const token = getReqAuthToken(req)
    const version = await fetchBeaconNodeHeartbeat(token)

    if (version) {
      return NextResponse.json({ data: 'success' }, { status: 200 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } catch (_) {
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
