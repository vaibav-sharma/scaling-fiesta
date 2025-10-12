'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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


export default function Page() {
    const router = useRouter()
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [loading, setLoading] = useState(false)
    // const [warming, setWarming] = useState(false)
    // const [serverStatus, setServerStatus] = useState(false)
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

    return (
        // <div className="min-h-screen grid lg:grid-cols-2">
        <div className="h-screen grid lg:grid-cols-2 overflow-hidden">
            {/* Left side */}
            <LeftSide />

            {/* Right side (form) */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
                <div className="w-full max-w-sm space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your username below to sign in to your account
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Sign in</CardTitle>
                            <CardDescription>to continue to your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    login()     // call Zustand action directly
                                }}
                                className="grid gap-4"
                            >                                
                            <div className="grid gap-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input
                                        id="id"
                                        type="text"
                                        placeholder="username"
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
                                    disabled={loading || warming}
                                    onClick={login}
                                    className="w-full bg-accent/20 hover:bg-accent/40 border border-accent/40 text-accent flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>

                            <div className="relative mt-4">
                                {/* <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div> */}
                                <div className="relative mt-4">
                                    {/* <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div> */}
                                    <div className="mt-auto">
                                        <Button
                                            onClick={warmUp}
                                            disabled={warming || loading}
                                            className="w-full bg-accent/20 hover:bg-accent/40 border border-accent/40 text-accent flex items-center justify-center"
                                        >
                                            {warming ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Server starting...
                                                </>
                                            ) : (
                                                serverStatus ? "Server Up" : "Warm Up Server"
                                            )}
                                        </Button>
                                    </div>

                                    {/* <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground pt-4">
                                        Or continue with
                                    </span>
                                </div> */}
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <Button variant="outline">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="mr-2 h-4 w-4"
                                    >
                                        <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.49v-1.72c-2.78.61-3.37-1.34-3.37-1.34a2.66 2.66 0 0 0-1.11-1.46c-.91-.63.07-.62.07-.62a2.1 2.1 0 0 1 1.53 1.03 2.13 2.13 0 0 0 2.91.83 2.13 2.13 0 0 1 .63-1.33c-2.22-.25-4.55-1.11-4.55-4.95a3.89 3.89 0 0 1 1.03-2.7 3.61 3.61 0 0 1 .1-2.66s.84-.27 2.75 1.03a9.39 9.39 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03a3.61 3.61 0 0 1 .1 2.66 3.89 3.89 0 0 1 1.03 2.7c0 3.85-2.34 4.7-4.57 4.95a2.39 2.39 0 0 1 .68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2" />
                                    </svg>
                                    GitHub
                                </Button>
                                <Button variant="outline">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="mr-2 h-4 w-4"
                                    >
                                        <path d="M21.35 11.1h-9.18v2.91h5.31c-.23 1.49-1.53 4.36-5.31 4.36-3.2 0-5.81-2.64-5.81-5.9S8 6.56 11.17 6.56a5.23 5.23 0 0 1 3.72 1.54l2.54-2.48A8.89 8.89 0 0 0 11.17 4C6.61 4 3 7.59 3 12.07s3.61 8.07 8.17 8.07c4.71 0 7.83-3.31 7.83-7.97 0-.54-.06-1.04-.16-1.53Z" />
                                    </svg>
                                    Google
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <div className="flex w-full flex-col items-center justify-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Don’t have an account?{' '}
                                    <a
                                        href="/register"
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Sign up
                                    </a>
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={handleGuest}
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Continue as Guest
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const LeftSide = () => {
    return <div className="relative hidden lg:flex flex-col bg-muted text-white dark:border-r overflow-hidden">
        <Image
            src="/homepage.svg"
            alt="Background illustration"
            fill
            priority
            className="object-contain object-center lg:object-cover z-0"
        />

        {/* Optional overlay for tint */}
        <div className="absolute inset-0 bg-primary/70 z-10" />

        {/* Foreground content */}
        <div className="relative z-20 flex flex-col justify-between h-full p-10">
            <div className="flex items-center text-lg font-medium">⚡ Dev Showcase</div>
            <blockquote className="space-y-2">
                <p className="text-lg">
                    “Building modern, modular interfaces with Next.js and shadcn/ui.”
                </p>
                <footer className="text-sm">– Your Name</footer>
            </blockquote>
        </div>
    </div>
}