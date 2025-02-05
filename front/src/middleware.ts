import axios from '@/lib/axios'
import { getCookie } from '@/lib/cookie'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = await getCookie('tkd-access-token')
  // const refreshToken = await getCookie('tkd-refresh-token');
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  })

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/', '/user', '/users'],
}
