import Link from "next/link"
import { AlertCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ShareNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Share Link Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This share link may have expired, been revoked, or the canvas may no longer be available.
        </p>
        <Link href="/">
          <Button className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        </Link>
      </Card>
    </div>
  )
}