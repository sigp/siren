import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchProposerDuties } from '../beacon'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchProposerDuties(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proposer data' }, { status: 500 })
  }
}
