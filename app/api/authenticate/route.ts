import axios from 'axios';
import { NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL

export async function POST(req: Request) {
  try {
    const {password} = await req.json();
    const res = await axios.post(`${backendUrl}/authenticate`, {password});

    console.log(res)

    if(!res?.data) {
      return NextResponse.json({ error: 'authPrompt.unableToReach' }, { status: 500 })
    }

    const token = res.data.access_token

    return NextResponse.json({token}, {status: 200})
  } catch (error) {
    return NextResponse.json({ error: error.response.data.message }, { status: 500 })
  }
}