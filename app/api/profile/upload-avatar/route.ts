import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, createSession } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `avatar_${user.id}_${timestamp}_${file.name}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    // Ensure uploads directory exists
    const fs = require('fs')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    await writeFile(filepath, buffer)

    const avatarUrl = `/uploads/${filename}`

    // Update user avatar in database
    const updatedUser = await prisma.userSignup.update({
      where: { id: user.id },
      data: { avatar: avatarUrl },
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
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar_url: avatarUrl,
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
