import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchPendingDeposits } from '../validator'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchPendingDeposits(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pending deposits' }, { status: 500 })
  }
}
