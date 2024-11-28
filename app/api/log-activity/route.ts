import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { logActivity } from '../activities'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const token = getReqAuthToken(req)
    await logActivity(data, token)

    return NextResponse.json('success', { status: 200 })
  } catch (error) {
    let status = 500
    let message = 'Unknown error occurred...'
    if (error instanceof Error && error.message.includes('401')) {
      status = 401
      message = error.message
    }
    return NextResponse.json({ error: message }, { status })
  }
}
