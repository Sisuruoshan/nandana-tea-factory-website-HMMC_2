import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { verifyPassword, createSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

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

    // Reference to users collection
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));

    // Find user by email
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const docSnapshot = snapshot.docs[0];
    const user = {
      id: docSnapshot.id,
      ...docSnapshot.data()
    } as any;

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
      avatar: user.avatar,
    }

    await createSession(sessionUser)

    const redirectUrl = redirect && redirect.startsWith('/') ? redirect : '/'

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: sessionUser,
      redirect: redirectUrl,
    })

    // Don't cache login responses
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
