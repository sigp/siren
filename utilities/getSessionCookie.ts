import { cookies } from 'next/headers'

const getSessionCookie = async (): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get('session-token')?.value
}

export default getSessionCookie
