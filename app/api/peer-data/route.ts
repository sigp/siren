import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchPeerData } from '../beacon'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchPeerData(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch peer data' }, { status: 500 })
  }
}
