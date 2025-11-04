import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { fetchPartialWithdrawals } from '../validator'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchPartialWithdrawals(token)
    return NextResponse.json(data)
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch partial withdrawals' }, { status: 500 })
  }
}
