import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../../utilities/getReqAuthToken'
import { fetchValidatorStatus } from '../../beacon'

export async function GET(req: Request, context: any) {
  try {
    const { pubKey } = context.params
    const token = getReqAuthToken(req)

    if (!token) {
      return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 })
    }

    if (!pubKey) {
      return NextResponse.json({ error: 'Missing pubKey data' }, { status: 500 })
    }

    const data = await fetchValidatorStatus(token, pubKey)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching val status:', error)
    const errorMessage = error.message || 'Failed to fetch validator status'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
