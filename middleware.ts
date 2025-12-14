import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'technomodern-admin-secret-key-2024'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Защищаем все /admin routes кроме /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (!payload.authenticated) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch {
      // Токен невалидный или истёк
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
