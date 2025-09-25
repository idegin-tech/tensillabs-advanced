"use client"

import { useState } from "react"
import Image from "next/image"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            console.log("Register attempt:", { firstName, lastName, email, password })
        } catch (error) {
            console.error("Register error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[40rem] w-[40rem] bg-gradient-conic from-primary/20 via-transparent to-primary/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md z-10">
                <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-xl">
                    <CardHeader className="space-y-8 text-center pt-8 pb-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl" />
                                <Image
                                    src="/brand/logo-light.png"
                                    alt="TensilLabs"
                                    width={180}
                                    height={56}
                                    className="relative"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Create your account
                            </CardTitle>
                            <CardDescription className="text-lg text-muted-foreground/80">
                                Get started with your collaborative workspace
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8 px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="firstName" className="text-sm font-medium">
                                        First name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="lastName" className="text-sm font-medium">
                                        Last name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <IconEyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <IconEye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Creating account...
                                    </div>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>
                        <div className="text-center pt-2">
                            <p className="text-sm text-muted-foreground/70">
                                Join thousands of teams already using TensilLabs
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
