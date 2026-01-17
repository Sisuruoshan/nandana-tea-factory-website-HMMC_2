import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionData = cookieStore.get('user_data')?.value

    if (!sessionData) {
      const response = NextResponse.json({ user: null })
      // Cache negative responses briefly to reduce load
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
      return response
    }

    const userData = JSON.parse(sessionData)
    
    // Only fetch from DB if we need fresh data, otherwise use cached cookie data
    // For better performance, we can use cookie data directly and only refresh when needed
    // But for avatar updates, we'll fetch fresh data
    const freshUser = await prisma.userSignup.findUnique({
      where: { id: userData.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    })

    if (!freshUser) {
      const response = NextResponse.json({ user: null })
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
      return response
    }

    const response = NextResponse.json({ user: freshUser })
    // Cache authenticated responses briefly
    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
    
    return response
  } catch (error) {
    console.error('Session check error:', error)
    const response = NextResponse.json({ user: null })
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    return response
  }
}
