import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken'
import { readActivity } from '../../activities'

export async function PUT(req: Request, context: any) {
  try {
    const { id } = context.params
    const token = getReqAuthToken(req)

    if (!id) {
      return NextResponse.json({ error: 'No activity id found' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 })
    }

    const data = await readActivity(id, token)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating activity history:', error)
    const errorMessage = error.message || 'Failed to update activity history'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
