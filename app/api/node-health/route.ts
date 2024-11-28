import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchNodeHealth } from '../beacon'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchNodeHealth(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch node health data' }, { status: 500 })
  }
}
