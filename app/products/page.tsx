'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  slug: string
  price: number
  image: string | null
  image2?: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const LIMIT = 9

  // Listen to header search events
  useEffect(() => {
    const handleHeaderSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail)
    }
    window.addEventListener('headerSearch', handleHeaderSearch as EventListener)
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch as EventListener)
    }
  }, [])

  // Debounce search and load products
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      loadProducts(1, searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadProducts = async (pageNum: number, search: string) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const queryParams = new URLSearchParams({
        is_wholesale: 'false',
        page: pageNum.toString(),
        limit: LIMIT.toString(),
      })
      if (search) queryParams.set('search', search)

      const res = await fetch(`/api/products?${queryParams.toString()}`, {
        next: { revalidate: 60 },
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
      if (res.ok) {
        const data = await res.json()
        const newProducts = data.products || []

        if (pageNum === 1) {
          setProducts(newProducts)
        } else {
          setProducts(prev => [...prev, ...newProducts])
        }

        setHasMore(newProducts.length === LIMIT)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadProducts(nextPage, searchQuery)
  }

  // Use server-side filtered products directly
  const filteredProducts = products

  const formatPrice = (value: number) => {
    return `Rs. ${value.toFixed(2)}`
  }

  const resolveImage = (path: string | null) => {
    if (!path) return '/images/image.png'
    if (path.startsWith('data:')) return path
    if (path.startsWith('http')) return path
    return `/${path.replace(/^\//, '')}`
  }

  return (
    <main className="container retail-container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <section className="page-header">
        <h1>Our Teas</h1>
      </section>

      <div className="product-controls">
        <Link href="/products" className="btn active">Retail</Link>
        <Link href="/wholesale" className="btn">Wholesale</Link>
      </div>

      {loading && page === 1 ? (
        <div id="product-loading" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-medium-green)' }}></i>
          <p style={{ marginTop: '10px' }}>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div id="no-results" style={{ padding: '40px', textAlign: 'center', color: '#555' }}>
          No matching products found.
        </div>
      ) : (
        <>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                  <Image
                    src={resolveImage(product.image)}
                    alt={product.name}
                    width={240}
                    height={180}
                    style={{ 
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: hoveredProduct === product.id && product.image2 ? 0 : 1,
                      transition: 'opacity 0.5s ease-in-out'
                    }}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  {product.image2 && (
                    <Image
                      src={resolveImage(product.image2)}
                      alt={`${product.name} - Tea`}
                      width={240}
                      height={180}
                      style={{ 
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                      }}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  )}
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price">{formatPrice(product.price)}</div>
                <Link href={`/product?id=${encodeURIComponent(product.slug)}`}>View More</Link>
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary"
                disabled={loadingMore}
                style={{ minWidth: '150px' }}
              >
                {loadingMore ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
