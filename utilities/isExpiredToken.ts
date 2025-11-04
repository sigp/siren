interface JwtPayload {
  exp?: number
  [key: string]: any
}

// Simple JWT decode function that works in Edge Runtime
// Only decodes the payload without verification (suitable for expiry checks)
const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode base64url to JSON
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    return JSON.parse(jsonPayload)
  } catch (_) {
    return null
  }
}

const isExpiredToken = (token: string) => {
  const decoded = decodeJwt(token)
  const now = Date.now() / 1000

  if (!decoded || !decoded.exp) {
    return false
  }

  return decoded.exp < now
}

export default isExpiredToken
