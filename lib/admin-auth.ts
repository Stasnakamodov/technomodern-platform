import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'technomodern-admin-secret-key-2024'
)

const COOKIE_NAME = 'admin_token'

export interface AdminSession {
  authenticated: boolean
  exp: number
}

/**
 * Проверить пароль и создать сессию
 */
export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Неверный пароль' }
  }

  // Создаём JWT токен на 7 дней
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET)

  // Сохраняем в cookie
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  })

  return { success: true }
}

/**
 * Проверить авторизацию
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return false
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.authenticated === true
  } catch {
    return false
  }
}

/**
 * Выйти из админки
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Получить сессию (для middleware)
 */
export async function getAdminSession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      authenticated: payload.authenticated as boolean,
      exp: payload.exp as number,
    }
  } catch {
    return null
  }
}
