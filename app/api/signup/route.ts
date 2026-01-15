import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, address } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let existingUser
    try {
      existingUser = await prisma.userSignup.findUnique({
        where: { email },
      })
    } catch (dbError: any) {
      console.error('Database connection error:', dbError.message)
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    let hashedPassword
    try {
      hashedPassword = await hashPassword(password)
    } catch (hashError: any) {
      console.error('Password hashing error:', hashError.message)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // Create user
    let user
    try {
      user = await prisma.userSignup.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: phone || null,
          address: address || null,
        },
      })
    } catch (createError: any) {
      console.error('User creation error:', createError.message)
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now login.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
