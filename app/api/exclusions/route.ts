import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchValidatorStatusExclusionList } from '../config'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchValidatorStatusExclusionList(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch exclusions: ${error}` }, { status: 500 })
  }
}
