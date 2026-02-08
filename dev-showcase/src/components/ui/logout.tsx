'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/src/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const handleLogout = async () => {
    // Clear local storage
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('authToken')
    localStorage.removeItem('googleApiKey')
    
    // Sign out from NextAuth (clears session)
    await signOut({ 
      callbackUrl: '/login',
      redirect: true 
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-300 transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}