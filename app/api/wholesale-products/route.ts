import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

// Don't force dynamic - allow Next.js caching to work
// export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Firestore query
    // We use where('isWholesale', '==', true) to filter at DB level.
    // We sort in memory to avoid potential 'Missing Index' errors during development 
    // when combining 'where' and 'orderBy' on different fields.
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isWholesale', '==', true));

    const snapshot = await getDocs(q);

    let products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
      }
    });

    // Sort by createdAt desc
    products.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: any) =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    const total = products.length;
    const paginatedProducts = products.slice(skip, skip + limit);

    // Map fields
    const resultProducts = paginatedProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      slug: p.slug,
      price: p.price,
      wholesalePrice: p.wholesalePrice,
      image: p.image,
      stock: p.stock,
      isWholesale: p.isWholesale,
      minWholesaleQty: p.minWholesaleQty,
    }));

    const response = NextResponse.json({
      products: resultProducts,
      page,
      limit,
      total,
    })
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    console.error('Get wholesale products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
