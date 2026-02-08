'use client'

import { usePathname } from 'next/navigation'
import LayoutHeader from "@/src/utils/LayoutHeader"

export function HeaderWrapper() {
  const pathname = usePathname()
  
  // Hide header on login page
  if (pathname === '/login') {
    return null
  }
  
  return <LayoutHeader />
}
