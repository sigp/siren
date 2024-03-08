import { NextResponse } from 'next/server';
import {fetchBeaconNodeVersion, fetchValidatorAuthKey} from './app/api/config';

const restrictedEndpoints = [
  '/setup/health-check',
] as any;

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!restrictedEndpoints.includes(pathname)) {
    return NextResponse.next();
  }

  const responses = await Promise.all([
    fetchBeaconNodeVersion(),
    fetchValidatorAuthKey(),
  ]);

  const hasError = responses.some(response => 'error' in response);

  if (hasError) {
    return NextResponse.redirect(new URL('/fuck', request.url));
  }


  return NextResponse.next();
}
