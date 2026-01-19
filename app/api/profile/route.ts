import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { requireAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const docRef = doc(db, 'users', user.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const data = docSnap.data();
    const userData = {
      id: docSnap.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      avatar: data.avatar,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    };

    const response = NextResponse.json(userData)
    // Do not cache profile data
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    return response
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { name, phone, address } = body

    const updateData: any = { updatedAt: Timestamp.now() }
    if (name) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address

    const userRef = doc(db, 'users', user.id);

    await updateDoc(userRef, updateData);

    const docSnap = await getDoc(userRef);
    const data = docSnap.data() as any;

    const updatedUser = {
      id: docSnap.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      avatar: data.avatar,
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { name, email, phone, address, current_password, password, password_confirmation } = body

    // Build update data object
    const updateData: any = { updatedAt: Timestamp.now() }

    if (name) updateData.name = name
    if (email && email !== user.email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address

    const userRef = doc(db, 'users', user.id);

    // Handle password update
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        return NextResponse.json(
          { message: 'Passwords do not match' },
          { status: 400 }
        )
      }

      if (!current_password) {
        return NextResponse.json(
          { message: 'Current password is required to change your password' },
          { status: 400 }
        )
      }

      // Verify current password
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        )
      }

      const userData = docSnap.data();
      const isPasswordValid = await bcrypt.compare(current_password, userData.password)

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    // Update user
    await updateDoc(userRef, updateData);

    // Fetch updated for response
    const updatedSnap = await getDoc(userRef);
    const updatedData = updatedSnap.data() as any;

    const updatedUser = {
      id: updatedSnap.id,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      address: updatedData.address,
      avatar: updatedData.avatar,
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
