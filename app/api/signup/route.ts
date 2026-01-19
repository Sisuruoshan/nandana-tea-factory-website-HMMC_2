import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { hashPassword } from '@/lib/auth'
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore'

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
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));

    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        )
      }
    } catch (dbError: any) {
      console.error('Database connection error:', dbError.message)
      return NextResponse.json(
        { error: `Database connection failed: ${dbError.message}` },
        { status: 503 }
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
    try {
      const newUser = {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(usersRef, newUser);

      return NextResponse.json({
        success: true,
        message: 'Account created successfully! You can now login.',
        user: {
          id: docRef.id,
          name: newUser.name,
          email: newUser.email,
        },
      })
    } catch (createError: any) {
      console.error('User creation error:', createError.message)
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
