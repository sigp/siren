import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken'
import { updateValGraffiti } from '../validator'

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const token = getReqAuthToken(req)

    const res = await updateValGraffiti(token, data)
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
