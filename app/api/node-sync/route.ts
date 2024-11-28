import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchSyncData } from '../beacon'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchSyncData(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sync status' }, { status: 500 })
  }
}
