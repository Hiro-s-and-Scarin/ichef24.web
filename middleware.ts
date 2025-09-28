import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('jwt')?.value

  // Redirecionar /home para / (página principal)
  if (pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Rotas que requerem autenticação
  const protectedRoutes = [
    '/history',
    '/favorites', 
    '/profile',
    '/recipe',
    '/my-recipe-book',
    '/plans',
    '/checkout',
    '/community',
    '/plans-required'
  ]

  // Verificar se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Se for uma rota protegida e não há token, redirecionar para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
