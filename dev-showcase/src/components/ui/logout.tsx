'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // clear login flag
    localStorage.removeItem('loggedIn')

    // optional: clear any tokens or cached data
    localStorage.removeItem('authToken')

    // redirect to login
    router.push('/login')
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600 hover:bg-red-100 border-red-300 transition-colors"
    >
      Logout
    </Button>
  )
}