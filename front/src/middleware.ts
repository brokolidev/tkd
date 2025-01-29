import { NextRequest, NextResponse } from 'next/server'
import { getCookie } from '@/lib/cookie'
import axios from '@/lib/axios'

export async function middleware(request: NextRequest) {

  const accessToken = await getCookie('tkd-access-token');
  // const refreshToken = await getCookie('tkd-refresh-token');
  const { pathname } = request.nextUrl;

  if (pathname === '/login') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  axios.interceptors.request.use((config) => {
    config.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return config;
  })
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/']
};