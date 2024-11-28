import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchBeaconNodeVersion } from '../config'

const errorMessage = 'Failed to maintain beacon heartbeat'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const { version } = await fetchBeaconNodeVersion(token)

    if (version) {
      return NextResponse.json({ data: 'success' }, { status: 200 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
