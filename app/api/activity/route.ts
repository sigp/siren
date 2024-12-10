import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchActivities } from '../activities'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const offset = searchParams.get('offset') || undefined
    const limit = searchParams.get('limit') || undefined
    const order = searchParams.get('order') || undefined
    const since = searchParams.get('since') || undefined

    const token = getReqAuthToken(req)
    const data = await fetchActivities({ token, offset, limit, order, since })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
