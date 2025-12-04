import type { NextRequest } from 'next/server'

const getReqAuthToken = (req: NextRequest): string => {
  return req.cookies.get('session-token')?.value ?? ''
}

export default getReqAuthToken
