import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export interface SessionUser {
  id: string
  name: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      return null
    }

    // In a real implementation, you'd store session data in a database or use NextAuth
    // For now, we'll use a simple cookie-based approach
    const sessionData = cookieStore.get('user_data')?.value
    if (sessionData) {
      return JSON.parse(sessionData) as SessionUser
    }
  } catch (error) {
    return null
  }

  return null
}

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  cookieStore.set('user_data', JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session_id')
  cookieStore.delete('user_data')
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
