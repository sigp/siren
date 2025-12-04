import {type NextRequest, NextResponse} from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { updateFeeRecipient } from '../validator'

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const token = getReqAuthToken(req)

    const res = await updateFeeRecipient(token, data)
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update fee recipient'
    // Check if it's a 401 authentication error
    const status = errorMessage.includes('Status: 401') ? 401 : 500
    return NextResponse.json({ error: errorMessage }, { status })
  }
}
