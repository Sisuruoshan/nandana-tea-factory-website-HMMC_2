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

    // Validate user ID exists before querying
    if (!userData.id) {
      const response = NextResponse.json({ user: null })
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
      return response
    }

    // Fetch fresh user data from database to get latest avatar and profile info
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
    // Do not cache authenticated responses to ensure logout is reflected immediately
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')

    return response
  } catch (error) {
    console.error('Session check error:', error)
    const response = NextResponse.json({ user: null })
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    return response
  }
}
