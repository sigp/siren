import { NextResponse } from 'next/server'
import { LogType } from '../../../src/types'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchLogData } from '../logs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const offset = searchParams.get('offset') || undefined
    const type = searchParams.get('type') || undefined
    const limit = searchParams.get('limit') || undefined
    const level = searchParams.get('level') || undefined

    const token = getReqAuthToken(req)
    const data = await fetchLogData({ token, limit, offset, type: type as LogType, level })
    return NextResponse.json(data)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch log data' }, { status: 500 })
  }
}
