import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import isExpiredToken from './utilities/isExpiredToken'

const restrictedEndpoints = [
  '/setup/health-check',
  '/setup/node-sync',
  '/dashboard',
  '/dashboard/logs',
  '/dashboard/settings',
  '/dashboard/validators',
] as any

const redirectToInitPage = (request: any, nextPath: string) => {
  return NextResponse.redirect(new URL(`/?redirect=${nextPath}`, request.url))
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  try {
    if (!restrictedEndpoints.includes(pathname)) {
      return NextResponse.next()
    }

    const token = cookies().get('session-token').value

    if (!token) {
      return redirectToInitPage(request, pathname)
    }

    if (isExpiredToken(token)) {
      return redirectToInitPage(request, pathname)
    }

    return NextResponse.next()
  } catch (e) {
    return redirectToInitPage(request, pathname)
  }
}
