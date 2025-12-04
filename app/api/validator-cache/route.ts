import {type NextRequest, NextResponse} from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchValCaches } from '../validator'

export async function GET(req: NextRequest) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchValCaches(token)
    return NextResponse.json(data)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch validator cache' }, { status: 500 })
  }
}
