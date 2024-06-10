import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken';
import { fetchLogMetrics } from '../logs';

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchLogMetrics(token)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch priority logs' }, { status: 500 })
  }
}
