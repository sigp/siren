import {type NextRequest, NextResponse} from 'next/server'
import { LogType } from '../../../src/types'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { searchLogData } from '../logs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || undefined
    const search = searchParams.get('search') || undefined

    const token = getReqAuthToken(req)
    const data = await searchLogData({ token, search, type: type as LogType })
    return NextResponse.json(data)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to search log data' }, { status: 500 })
  }
}
