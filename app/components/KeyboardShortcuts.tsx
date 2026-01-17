'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function KeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift + A only on home page
      if (pathname === '/' && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        router.push('/admin-login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router, pathname])

  return null
}
