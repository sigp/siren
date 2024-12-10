const parseCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) return {}
  return cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split('=').map((c) => c.trim())
      acc[key] = decodeURIComponent(value)
      return acc
    },
    {} as Record<string, string>,
  )
}

const getReqAuthToken = (req: Request): string => {
  try {
    const cookie = parseCookies(req.headers.get('cookie'))
    const authToken = cookie['session-token']
    if (!authToken) return ''
    return authToken
  } catch (e) {
    return ''
  }
}

export default getReqAuthToken
