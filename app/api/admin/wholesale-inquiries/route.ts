import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const inquiriesRef = collection(db, 'wholesale_inquiries');
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const inquiries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
      }
    });

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Get wholesale inquiries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
