import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken';
import { fetchValMetrics } from '../../validator';

export async function GET(req: Request, context: any) {
  try {
    const { index } = context.params;
    const token = getReqAuthToken(req)

    if (!token) {
      return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 });
    }

    const data = await fetchValMetrics(token, index)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching val metrics:', error);
    const errorMessage = error.message || 'Failed to fetch validator metrics';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
