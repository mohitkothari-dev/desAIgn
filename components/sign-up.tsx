
"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignUp() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSignUp = async () => {
        setError(null)
        if (password !== passwordConfirmation) {
            setError("Passwords do not match")
            return
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }
        setLoading(true)
        await authClient.signUp.email({
            email,
            password,
            name: `${firstName} ${lastName}`,
        }, {
            onRequest: () => {
                setLoading(true)
            },
            onSuccess: () => {
                router.push("/dashboard")
                router.refresh()
            },
            onError: (ctx) => {
                const message = ctx.error.message.replace(/^\[.*?\]\s*/, "")
                setError(message)
                setLoading(false)
            }
        })
        setLoading(false)
    }

    const handleSocialSignUp = async (provider: "github" | "google") => {
        setError(null)
        await authClient.signIn.social({ // Social sign up is same as sign in
            provider,
            callbackURL: "/dashboard"
        }, {
            onSuccess: () => {
                router.push("/dashboard")
            },
            onError: (ctx) => {
                setError(ctx.error.message)
            }
        })
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                                type="text"
                                id="first-name"
                                placeholder="Max"
                                required
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                    setError(null)
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                                type="text"
                                id="last-name"
                                placeholder="Robinson"
                                required
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                    setError(null)
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError(null)
                            }}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError(null)
                            }}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password-confirmation">Confirm Password</Label>
                        <Input
                            id="password-confirmation"
                            type="password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => {
                                setPasswordConfirmation(e.target.value)
                                setError(null)
                            }}
                        />
                    </div>
                    {error && (
                        <div className="text-destructive text-sm">{error}</div>
                    )}
                    <Button type="submit" className="w-full" onClick={handleSignUp} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create an account
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleSocialSignUp("github")}>
                        Sign up with GitHub
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleSocialSignUp("google")}>
                        Sign up with Google
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
