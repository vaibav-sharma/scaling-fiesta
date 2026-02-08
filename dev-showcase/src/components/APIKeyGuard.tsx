'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { APIKeyModal } from '@/src/components/APIKeyModal'
import { useAPIKeyStore } from '@/src/store/apiKeyStore'

export function APIKeyGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)
  const { hasApiKey } = useAPIKeyStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Show modal if user is authenticated but has no API key
    if (mounted && session && !hasApiKey()) {
      setShowModal(true)
    }
  }, [session, mounted])

  if (!mounted) return children

  return (
    <>
      <APIKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {children}
    </>
  )
}
