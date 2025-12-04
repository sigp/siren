import axios from 'axios'
import {type NextRequest, NextResponse} from 'next/server'
import { BACKEND_URL, NODE_ENV, SSL_ENABLED } from '../../../src/constants/envars'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const res = await axios.post(`${BACKEND_URL}/authenticate`, { password })

    if (!res?.data) {
      return NextResponse.json({ error: 'authPrompt.unableToReach' }, { status: 500 })
    }

    const token = res.data.access_token

    const response = NextResponse.json(true, { status: 200 })

    response.cookies.set('session-token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production' && SSL_ENABLED,
      path: '/',
      sameSite: 'strict',
    } as any)

    return response
  } catch (error: any) {
    let message = error?.response?.data?.message

    if (!message) {
      message = 'authPrompt.defaultErrorMessage'
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
