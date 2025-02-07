import axios from '@/lib/axios'
import { getCookie } from '@/lib/cookie'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = await getCookie('tkd-access-token')
  const userRole = await getCookie('tkd-user-role')
  // const refreshToken = await getCookie('tkd-refresh-token');
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    if (accessToken) {
      
      if (userRole === 'Admin' || userRole === 'Instructor') {
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (userRole === 'Student') {
        return NextResponse.redirect(new URL('/student', request.url))
      }
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
  matcher: ['/login', '/', '/users', '/schedules', '/events', '/settings', '/student'],
}
