'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { APIKeyModal } from '@/src/components/APIKeyModal'
import { useAPIKeyStore } from '@/src/store/apiKeyStore'

export function APIKeyGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)
  const { hasApiKey } = useAPIKeyStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Show modal if user is authenticated but has no API key
    // Skip on login page to avoid flashing modal during OAuth redirect
    if (mounted && session && !hasApiKey() && pathname !== '/login') {
      setShowModal(true)
    }
  }, [session, mounted, pathname])

  if (!mounted) return children

  return (
    <>
      <APIKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {children}
    </>
  )
}
