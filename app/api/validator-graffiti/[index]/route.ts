import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken'
import { fetchValGraffiti } from '../../validator'

export async function GET(req: Request, context: any) {
  try {
    const { index } = context.params
    const token = getReqAuthToken(req)

    if (!index) {
      return NextResponse.json({ error: 'No validator index found' }, { status: 400 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 })
    }

    const data = await fetchValGraffiti(token, index)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching val graffiti:', error)
    const errorMessage = error.message || 'Failed to fetch validator graffiti'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
