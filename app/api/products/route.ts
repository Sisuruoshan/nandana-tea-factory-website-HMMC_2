import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
  Timestamp,
  limit as firestoreLimit
} from 'firebase/firestore'

// Don't force dynamic - allow Next.js caching to work
// export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isWholesale = searchParams.get('is_wholesale')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')

    // Reference to products collection
    const productsRef = collection(db, 'products');

    // Fetch all products (Strategy: Read all and filter in memory for search/pagination flexibility 
    // without advanced search services. Suitable for catalogs < 1000 items)
    // For larger datasets, we would implement cursor-based pagination and simpler server-side filtering.
    const snapshot = await getDocs(query(productsRef, orderBy('createdAt', 'desc')));

    let products = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
      }
    });

    // Filter by isWholesale
    if (isWholesale === 'true') {
      products = products.filter((p: any) => p.isWholesale === true);
    } else if (isWholesale === 'false') {
      products = products.filter((p: any) => p.isWholesale === false);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: any) =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = products.length;
    const skip = (page - 1) * limit;
    const paginatedProducts = products.slice(skip, skip + limit);

    // Map to specific shape if needed (though we already have the full object)
    const resultProducts = paginatedProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      slug: p.slug,
      price: p.price,
      image: p.image,
      stock: p.stock,
      isWholesale: p.isWholesale,
      wholesalePrice: p.wholesalePrice,
    }));

    const response = NextResponse.json({
      products: resultProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

    return response
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      slug,
      price,
      wholesalePrice,
      image,
      origin,
      notes,
      brewingGuide,
      longDescription,
      stock,
      isWholesale,
    } = body

    if (!name || !description || !slug || price === undefined) {
      return NextResponse.json(
        { error: 'Name, description, slug, and price are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    const newProduct = {
      name,
      description,
      slug,
      price,
      wholesalePrice: wholesalePrice || null,
      image: image || null,
      origin: origin || null,
      notes: notes || null,
      brewingGuide: brewingGuide || null,
      longDescription: longDescription || null,
      stock: stock || 0,
      isWholesale: isWholesale || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(productsRef, newProduct);

    return NextResponse.json({ id: docRef.id, ...newProduct }, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
