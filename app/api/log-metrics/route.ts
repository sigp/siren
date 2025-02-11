import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchMetrics } from '../logs'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchMetrics(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs metrics' }, { status: 500 })
  }
}
