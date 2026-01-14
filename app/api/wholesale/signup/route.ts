import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, name, email, phone, address } = body

    if (!company || !name || !email) {
      return NextResponse.json(
        { error: 'Company, name, and email are required' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.wholesaleInquiry.create({
      data: {
        company,
        name,
        email,
        phone: phone || null,
        address: address || null,
        details: 'Wholesale Account Signup',
        status: 'new',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Signup submitted! An admin will review your application.',
      inquiry,
    })
  } catch (error: any) {
    console.error('Wholesale signup error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
