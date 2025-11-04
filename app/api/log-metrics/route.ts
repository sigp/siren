import { NextResponse } from 'next/server'
import { LogType } from '../../../src/types'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchMetrics } from '../logs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || undefined

    const token = getReqAuthToken(req)
    const data = await fetchMetrics(token, type as LogType)
    return NextResponse.json(data)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch logs metrics' }, { status: 500 })
  }
}
