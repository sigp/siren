import { NextResponse } from 'next/server'
import { fetchExecutionSync } from '../beacon';

export async function GET() {
  try {
    const { data } = await fetchExecutionSync();
    return NextResponse.json({data: data})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch execution sync status' }, {status: 500})
  }
}
