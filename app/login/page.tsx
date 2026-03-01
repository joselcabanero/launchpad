'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Rocket, TrendingUp, Layers, Users, ArrowRight } from 'lucide-react'

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
        <div className="flex min-h-screen font-inter">
            {/* Left branding panel */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#1A1A1A] flex-col justify-between p-12 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent-primary/5 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent-secondary/5 blur-3xl" />
                    <div className="absolute top-1/2 -right-16 w-64 h-64 rounded-full bg-accent-primary/3 blur-2xl" />
                </div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-primary flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Launchpad</span>
                </div>

                {/* Main content */}
                <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            Accelerate the<br />
                            <span className="text-accent-primary">next generation</span><br />
                            of foodtech
                        </h1>
                        <p className="text-[#8A7A6A] text-base leading-relaxed max-w-xs">
                            The all-in-one OS for managing accelerator programs, pipelines, and startup evaluations.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: Layers, title: 'Multi-program management', desc: 'Run multiple cohorts simultaneously' },
                            { icon: TrendingUp, title: 'Real-time pipeline', desc: 'Track every startup through your funnel' },
                            { icon: Users, title: 'Structured evaluation', desc: 'Score and compare applicants fairly' },
                        ].map((feature) => (
                            <div key={feature.title} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-md bg-accent-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <feature.icon className="w-4 h-4 text-accent-primary" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-[#F5EACE]">{feature.title}</p>
                                    <p className="text-[12px] text-[#8A7A6A]">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer tagline */}
                <div className="relative z-10">
                    <p className="text-[11px] text-[#4A4A4A] uppercase tracking-widest font-semibold">Powered by Eatable Adventures</p>
                </div>
            </div>

            {/* Right login panel */}
            <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-16">
                <div className="w-full max-w-sm space-y-8 animate-slide-up">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="w-9 h-9 rounded-lg bg-accent-primary flex items-center justify-center">
                            <Rocket className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-text-primary tracking-tight">Launchpad</span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">Welcome back</h2>
                        <p className="text-sm text-text-muted">Sign in to access the Accelerator OS.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[13px] font-semibold text-text-primary">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-surface border-border focus-visible:ring-accent-primary focus-visible:ring-1 text-[14px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-[13px] font-semibold text-text-primary">Password</Label>
                                <a href="#" className="text-[12px] text-accent-primary hover:text-accent-secondary transition-colors font-medium">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 bg-surface border-border focus-visible:ring-accent-primary focus-visible:ring-1 text-[14px]"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-accent-primary text-white hover:brightness-95 transition-all font-semibold text-[14px] flex items-center gap-2 mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                'Signing in...'
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-[11px] text-text-muted/60">
                        Protected access · Internal use only
                    </p>
                </div>
            </div>
        </div>
    )
}
