'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Shield } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            toast.success('Successfully signed in')
            router.push('/dashboard')
        } catch (error: any) {
            console.error('Login error:', error)
            toast.error(error.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4 font-inter">
            <Card className="w-full max-w-md border-border bg-surface shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-accent-primary" />
                            <span className="text-2xl font-bold text-text-primary tracking-tighter">LAUNCHPAD</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-text-primary">Welcome back</CardTitle>
                    <CardDescription className="text-text-muted">
                        Enter your credentials to access the Accelerator OS.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-text-primary">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@eatableadventures.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white border-border focus:ring-accent-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password text-text-primary">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white border-border focus:ring-accent-primary"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-accent-primary text-text-inverse hover:brightness-90 transition-all h-11"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
