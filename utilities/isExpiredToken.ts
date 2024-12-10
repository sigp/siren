import jwt, { JwtPayload } from 'jsonwebtoken'

const isExpiredToken = (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload
  const now = Date.now() / 1000

  if (!decoded || !decoded.exp) {
    return false
  }

  return decoded.exp < now
}

export default isExpiredToken
