import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken';
import { fetchPriorityLogs } from '../../logs';

export async function GET(req: Request, context: any) {
  try {
    const { page } = context.params;
    const token = getReqAuthToken(req)
    const data = await fetchPriorityLogs(token, page)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch priority logs' }, { status: 500 })
  }
}
