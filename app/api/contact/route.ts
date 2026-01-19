import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const inquiriesRef = collection(db, 'inquiries');

    const newInquiry = {
      name,
      email,
      subject,
      message,
      status: 'new',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(inquiriesRef, newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted! We will contact you soon.',
      inquiry: { id: docRef.id, ...newInquiry },
    })
  } catch (error) {
    console.error('Contact inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
