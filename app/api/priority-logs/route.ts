import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchPriorityLogs } from '../logs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || undefined
    const limit = searchParams.get('limit') || undefined
    const order = searchParams.get('order') || undefined
    const since = searchParams.get('since') || undefined

    const token = getReqAuthToken(req)
    const data = await fetchPriorityLogs({ token, type, limit, order, since })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch priority logs' }, { status: 500 })
  }
}
