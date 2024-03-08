import { NextResponse } from 'next/server'
import { fetchBeaconSync } from '../beacon';

export async function GET() {
  try {
    const { data } = await fetchBeaconSync();
    return NextResponse.json({data: data})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch beacon sync status' }, {status: 500})
  }
}
