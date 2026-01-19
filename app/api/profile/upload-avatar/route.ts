import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { requireAuth, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate request size for Firestore
    // Firestore limit: 1 MiB. Safe limit for avatar string: ~750KB
    // 750KB in bytes = 768,000 bytes.
    if (file.size > 768000) {
      return NextResponse.json(
        { error: 'File too large. Max size is 750KB for Base64 storage.' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert image to base64
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

    // Double check final string length (1 char ~= 1 byte)
    if (base64Image.length > 1000000) {
      return NextResponse.json(
        { error: 'Encoded image is too large for database storage.' },
        { status: 400 }
      )
    }

    // Update user avatar in database
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, { avatar: base64Image });

    // Get updated user data for session
    const userSnap = await getDoc(userRef);
    const updatedUser = userSnap.data() as any;

    // Update session with new avatar
    await createSession({
      id: user.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: base64Image,
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar_url: base64Image,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Upload avatar error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
