import {type NextRequest, NextResponse} from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchValidatorVersion } from '../config'

export async function GET(req: NextRequest) {
  try {
    const token = getReqAuthToken(req)
    const { version } = await fetchValidatorVersion(token)
    return NextResponse.json({ version })
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch lighthouse version' }, { status: 500 })
  }
}
