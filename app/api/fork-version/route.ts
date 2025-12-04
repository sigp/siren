import {type NextRequest, NextResponse} from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchForkVersion } from '../beacon'

export async function GET(req: NextRequest) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchForkVersion(token)
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch fork version data' }, { status: 500 })
  }
}
