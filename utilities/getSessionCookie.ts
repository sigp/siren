import { cookies } from 'next/headers'

const getSessionCookie = () => {
  const cookieStore = cookies()
  return cookieStore?.get('session-token')?.value || ''
}

export default getSessionCookie
