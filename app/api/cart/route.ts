import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, writeBatch, Timestamp } from 'firebase/firestore'
import { requireAuth } from '@/lib/auth'

const FALLBACK_IMAGE = '/images/image.png'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    // Find cart for user
    const cartsRef = collection(db, 'carts');
    const q = query(cartsRef, where('userId', '==', user.id));
    const cartSnapshot = await getDocs(q);

    if (cartSnapshot.empty) {
      const response = NextResponse.json({
        items: [],
        total: 0,
        count: 0,
      })
      response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=30')
      return response
    }

    const cartDoc = cartSnapshot.docs[0];
    const cartId = cartDoc.id;
    const cartData = cartDoc.data();

    // Get items from subcollection
    const itemsRef = collection(db, 'carts', cartId, 'items');
    const itemsSnapshot = await getDocs(itemsRef);

    const items = await Promise.all(itemsSnapshot.docs.map(async (itemDoc) => {
      const itemData = itemDoc.data();

      // Fetch product details
      const productRef = doc(db, 'products', itemData.productId);
      const productSnap = await getDoc(productRef);
      const productData = productSnap.exists() ? productSnap.data() : null;

      return {
        id: itemDoc.id,
        product_id: itemData.productId,
        product_name: productData?.name || 'Unknown Product',
        product_image: productData?.image || FALLBACK_IMAGE,
        quantity: itemData.quantity,
        price: Number(itemData.price),
        subtotal: Number(itemData.subtotal),
      }
    }));

    const response = NextResponse.json({
      items,
      total: Number(cartData.totalAmount || 0),
      count: items.length,
    })

    // Prevent caching for cart data to ensure real-time updates
    response.headers.set('Cache-Control', 'no-store, max-age=0')

    return response
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Get cart error:', error)
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
    const { product_id, quantity } = body

    if (!product_id || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    const productRef = doc(db, 'products', product_id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = productSnap.data();

    // Check stock availability
    if (product.stock !== null && product.stock !== undefined) {
      if (product.stock < quantity) {
        return NextResponse.json(
          { error: `Insufficient stock. Only ${product.stock} units available.` },
          { status: 400 }
        )
      }
    }

    // Use wholesale price for wholesale products if available
    const effectivePrice =
      (product.isWholesale && product.wholesalePrice != null)
        ? Number(product.wholesalePrice)
        : Number(product.price)

    // Get or create cart
    const cartsRef = collection(db, 'carts');
    const q = query(cartsRef, where('userId', '==', user.id));
    const cartSnapshot = await getDocs(q);

    let cartId;
    let cartRef;

    if (cartSnapshot.empty) {
      const newCart = {
        userId: user.id,
        totalAmount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const newCartDoc = await addDoc(cartsRef, newCart);
      cartId = newCartDoc.id;
      cartRef = newCartDoc; // This is a DocumentReference
    } else {
      cartId = cartSnapshot.docs[0].id;
      cartRef = doc(db, 'carts', cartId);
    }

    // Items subcollection
    const itemsRef = collection(db, 'carts', cartId, 'items');

    // Check if product already exists in cart subcollection
    const itemQ = query(itemsRef, where('productId', '==', product_id));
    const itemSnapshot = await getDocs(itemQ);

    if (!itemSnapshot.empty) {
      const existingItemDoc = itemSnapshot.docs[0];
      const existingItem = existingItemDoc.data();

      // Check if total quantity exceeds stock
      const newQuantity = existingItem.quantity + quantity
      if (product.stock !== null && product.stock !== undefined && product.stock < newQuantity) {
        return NextResponse.json(
          { error: `Insufficient stock. Only ${product.stock} units available (you already have ${existingItem.quantity} in cart).` },
          { status: 400 }
        )
      }

      // Update quantity
      const newSubtotal = effectivePrice * newQuantity

      await updateDoc(doc(itemsRef, existingItemDoc.id), {
        quantity: newQuantity,
        subtotal: newSubtotal,
        updatedAt: Timestamp.now()
      });

      // Decrease product stock
      if (product.stock !== null && product.stock !== undefined) {
        await updateDoc(productRef, {
          stock: product.stock - quantity
        });
      }
    } else {
      // Create new cart item
      await addDoc(itemsRef, {
        productId: product_id,
        quantity,
        price: effectivePrice,
        subtotal: effectivePrice * quantity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Decrease product stock
      if (product.stock !== null && product.stock !== undefined) {
        await updateDoc(productRef, {
          stock: product.stock - quantity
        });
      }
    }

    // Update cart total (Recalculate all items)
    const allItemsSnapshot = await getDocs(itemsRef);
    const totalAmount = allItemsSnapshot.docs.reduce(
      (sum, item) => sum + Number(item.data().subtotal),
      0
    );

    await updateDoc(doc(db, 'carts', cartId), { // Reuse doc reference manually if needed, but safe here
      totalAmount,
      updatedAt: Timestamp.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully.',
      cart_count: allItemsSnapshot.size,
      cart_total: totalAmount,
    })

  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()

    const cartsRef = collection(db, 'carts');
    const q = query(cartsRef, where('userId', '==', user.id));
    const cartSnapshot = await getDocs(q);

    if (!cartSnapshot.empty) {
      const cartDoc = cartSnapshot.docs[0];
      const cartId = cartDoc.id;

      const itemsRef = collection(db, 'carts', cartId, 'items');
      const itemsSnapshot = await getDocs(itemsRef);

      const batch = writeBatch(db);

      // Restore stock for all items
      // Note: In a real high-frequency app, we'd handle this more carefully for race conditions
      for (const itemDoc of itemsSnapshot.docs) {
        const item = itemDoc.data();
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          if (productData.stock !== null && productData.stock !== undefined) {
            batch.update(productRef, {
              stock: productData.stock + item.quantity
            });
          }
        }

        // Delete item
        batch.delete(itemDoc.ref);
      }

      // Update cart total
      batch.update(cartDoc.ref, {
        totalAmount: 0,
        updatedAt: Timestamp.now()
      });

      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully.',
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
