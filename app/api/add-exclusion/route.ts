import {NextRequest, NextResponse} from 'next/server'
import { BACKEND_URL } from '../../../src/constants/envars'
import fetchFromApi from '../../../utilities/fetchFromApi'
import getReqAuthToken from '../../../utilities/getReqAuthToken'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = getReqAuthToken(req)
    const data = await fetchFromApi(`${BACKEND_URL}/exclude-status`, token, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return NextResponse.json(data, { status: 200 })
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
