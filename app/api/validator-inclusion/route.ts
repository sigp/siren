import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchInclusionRate } from '../beacon'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchInclusionRate(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator inclusion data' }, { status: 500 })
  }
}
