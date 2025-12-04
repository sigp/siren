import {type NextRequest, NextResponse} from 'next/server'
import { BACKEND_URL } from '../../../src/constants/envars'
import fetchFromApi from '../../../utilities/fetchFromApi'
import getReqAuthToken from '../../../utilities/getReqAuthToken'

export async function POST(req: NextRequest) {
  try {
    const token = getReqAuthToken(req)
    const { status } = await fetchFromApi(`${BACKEND_URL}/logout`, token, {
      method: 'POST',
    })

    const response = NextResponse.json(true, { status })

    response.cookies.delete('session-token')

    return response
  } catch (error: any) {
    let message = error?.response?.data?.message

    if (!message) {
      message = 'authPrompt.unableToEndSession'
    }

    console.log(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
