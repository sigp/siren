import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken'
import { dismissLogAlert } from '../../logs'

export async function PUT(req: Request, context: any) {
  try {
    const { index } = context.params
    const token = getReqAuthToken(req)

    if (!index) {
      return NextResponse.json({ error: 'No log index found' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 })
    }

    const data = await dismissLogAlert(token, index)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error dismissing log alert:', error)
    const errorMessage = error.message || 'Failed to dismiss log alert'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
