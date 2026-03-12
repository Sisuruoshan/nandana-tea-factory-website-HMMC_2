import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

// Clear the current session so the user is fully signed out.
export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
