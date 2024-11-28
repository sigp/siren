import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchBeaconNodeVersion } from '../config'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const { version } = await fetchBeaconNodeVersion(token)
    return NextResponse.json({ version })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch beacon version' }, { status: 500 })
  }
}
