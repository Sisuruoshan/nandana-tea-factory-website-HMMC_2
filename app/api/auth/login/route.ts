import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, redirect } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.userSignup.findUnique({
      where: { email },
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    await createSession(sessionUser)

    const redirectUrl = redirect && redirect.startsWith('/') ? redirect : '/'

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: sessionUser,
      redirect: redirectUrl,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
