import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken';
import { fetchLogMetrics } from '../../logs';

export async function GET(req: Request, context: any) {
  try {
    const { type } = context.params;

    const token = getReqAuthToken(req)
    const data = await fetchLogMetrics(token, type)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch log metrics' }, { status: 500 })
  }
}
