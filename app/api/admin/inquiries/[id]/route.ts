import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, deleteDoc, updateDoc, getDoc, Timestamp } from 'firebase/firestore'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiryRef = doc(db, 'inquiries', params.id);
    await deleteDoc(inquiryRef);

    return NextResponse.json({ message: 'Inquiry deleted' })
  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { reply } = body

    if (!reply) {
      return NextResponse.json(
        { error: 'Reply is required' },
        { status: 400 }
      )
    }

    const inquiryRef = doc(db, 'inquiries', params.id);

    await updateDoc(inquiryRef, {
      reply,
      status: 'replied',
      updatedAt: Timestamp.now()
    });

    // Return updated doc
    const snap = await getDoc(inquiryRef);
    const data = snap.data();

    const inquiry = {
      id: snap.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(data?.createdAt),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(data?.updatedAt)
    };

    // TODO: Send email notification
    // For now, we'll just return success

    return NextResponse.json({
      message: 'Reply sent and saved successfully',
      inquiry,
    })
  } catch (error) {
    console.error('Reply to inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
