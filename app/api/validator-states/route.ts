import {type NextRequest, NextResponse} from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchValStates } from '../validator'

export async function GET(req: NextRequest) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchValStates(token)
    return NextResponse.json(data)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch validator state data' }, { status: 500 })
  }
}
