import { NextResponse } from 'next/server'
import fetchFromApi from "../../../utilities/fetchFromApi";
import getReqAuthToken from "../../../utilities/getReqAuthToken";

const backendUrl = process.env.BACKEND_URL

export async function POST(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const { status } = await fetchFromApi(`${backendUrl}/logout`, token, {
      method: 'POST'
    })

    return NextResponse.json(true, { status })
  } catch (error: any) {
    let message = error?.response?.data?.message

    if (!message) {
      message = 'authPrompt.defaultErrorMessage'
    }

    console.log(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
