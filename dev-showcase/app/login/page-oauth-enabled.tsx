'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/src/components/ui/card'
import { apiRequest } from '@/src/utils/apiClient'
import Image from 'next/image'
import { Loader2 } from "lucide-react"
import { useAuthStore } from '@/src/store/authStore'
import { GoogleSignInButton } from '@/src/components/GoogleSignInButton'

export default function LoginPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [oauthLoading, setOAuthLoading] = useState(false)
    const [oauthError, setOAuthError] = useState<string | null>(null)

    const {
        email,
        password,
        loading,
        warming,
        serverStatus,
        setEmail,
        setPassword,
        login,
        warmUp,
        logout,
    } = useAuthStore()

    const handleGuest = () => {
        localStorage.setItem('loggedIn', 'true')
        router.push('/')
    }

    const handleGoogleSignIn = async () => {
        setOAuthLoading(true)
        setOAuthError(null)
        try {
            await signIn('google', {
                redirect: true,
                callbackUrl: '/',
            })
        } catch (error) {
            setOAuthError(error instanceof Error ? error.message : 'Authentication failed')
        } finally {
            setOAuthLoading(false)
        }
    }

    // Redirect if already authenticated via OAuth
    if (session) {
        router.push('/')
    }

    return (
        <div className="grid lg:grid-cols-2 overflow-hidden min-h-screen">
            {/* Left side */}
            <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div>
                    <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
                    <p className="text-lg mb-8 opacity-90">
                        Sign in to access your personalized dashboard and manage your preferences securely.
                    </p>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-center gap-3">
                            <span className="text-2xl">✓</span>
                            <span>Secure OAuth authentication</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-2xl">✓</span>
                            <span>One-click sign in with Google</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-2xl">✓</span>
                            <span>Protected user data & privacy</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-2xl">✓</span>
                            <span>Automatic session management</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right side (form) */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 bg-gray-50">
                <div className="w-full max-w-sm space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Sign in</CardTitle>
                            <CardDescription>to continue to your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* OAuth Sign In */}
                            <div className="space-y-3">
                                <GoogleSignInButton isLoading={oauthLoading} />
                                
                                {oauthError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                                        {oauthError}
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                                </div>
                            </div>

                            {/* Email/Password Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    login()
                                }}
                                className="grid gap-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                            </form>

                            {/* Guest Access */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGuest}
                                className="w-full"
                            >
                                Continue as Guest
                            </Button>
                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}
