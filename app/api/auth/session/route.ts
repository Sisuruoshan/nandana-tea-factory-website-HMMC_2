import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionData = cookieStore.get('user_data')?.value

    if (!sessionData) {
      return NextResponse.json({ user: null })
    }

    const userData = JSON.parse(sessionData)
    
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
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: freshUser })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}}
