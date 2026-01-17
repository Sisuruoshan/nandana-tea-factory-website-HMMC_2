import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
<<<<<<< Updated upstream
import { requireAuth } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
=======
import { requireAuth, createSession } from '@/lib/auth'
>>>>>>> Stashed changes

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
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

<<<<<<< Updated upstream
    // Update user avatar
    await prisma.userSignup.update({
      where: { id: user.id },
      data: { avatar: avatarUrl },
=======
    // Update user avatar in database with base64 string
    const updatedUser = await prisma.userSignup.update({
      where: { id: user.id },
      data: { avatar: base64Image },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    })

    // Update session with new avatar
    await createSession({
      id: updatedUser.id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
>>>>>>> Stashed changes
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
<<<<<<< Updated upstream
      avatar: avatarUrl,
=======
      avatar_url: base64Image,
>>>>>>> Stashed changes
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Upload avatar error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
