
"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { Loader2 } from "lucide-react" // assuming lucide-react is installed with shadcn
import Link from "next/link"
import { useRouter } from "next/navigation"

export function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSignIn = async () => {
        setError(null)
        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }
        setLoading(true)
        await authClient.signIn.email({
            email,
            password,
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

    const handleSocialSignIn = async (provider: "github" | "google") => {
        setError(null)
        await authClient.signIn.social({
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
        <Card className="max-w-md w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
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
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
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
                    {error && (
                        <div className="text-destructive text-sm">{error}</div>
                    )}
                    <Button type="submit" className="w-full" onClick={handleSignIn} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Login
                    </Button>
                    <div className="flex flex-col items-center gap-2">
                        <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn("github")}>
                            GitHub
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn("google")}>
                            Google
                        </Button>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
