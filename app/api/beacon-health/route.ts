import { NextResponse } from 'next/server'
import { fetchBeaconHealth } from '../beacon';

export async function GET() {
  try {
    const { data } = await fetchBeaconHealth();
    return NextResponse.json({data: data})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch beacon health data' }, {status: 500})
  }
}
