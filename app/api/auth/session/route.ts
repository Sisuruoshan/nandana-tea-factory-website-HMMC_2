import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

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
    const docRef = doc(db, 'users', userData.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const response = NextResponse.json({ user: null })
      response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
      return response
    }

    const data = docSnap.data();
    const freshUser = {
      id: docSnap.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || null, // Ensure explicit null if undefined for JSON
    };

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
