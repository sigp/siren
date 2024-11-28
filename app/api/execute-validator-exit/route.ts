import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { submitSignedExit } from '../beacon'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const token = getReqAuthToken(req)

    const res = await submitSignedExit(data, token)
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
