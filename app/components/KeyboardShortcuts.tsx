'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Shift + A
      if (event.shiftKey && event.key === 'A') {
        event.preventDefault()
        router.push('/admin-login')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  return null
}
