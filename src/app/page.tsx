
"use client"

import Link from "next/link"
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
import { BookOpenCheck, Twitter } from "lucide-react"

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.92 4.48 1.69l2.52-2.52C18.48 2.44 15.98 1 12.48 1 5.88 1 1 5.88 1 12.48s4.88 11.48 11.48 11.48c3.47 0 6.28-1.18 8.35-3.35 2.13-2.2 2.72-5.23 2.72-8.35 0-.73-.06-1.42-.18-2.08H12.48z" />
    </svg>
)

const MetaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Meta</title>
        <path d="M22.09 0H1.91C.86 0 0 .86 0 1.91v20.18c0 1.05.86 1.91 1.91 1.91h20.18c1.05 0 1.91-.86 1.91-1.91V1.91C24 .86 23.14 0 22.09 0ZM15.33 8.34h-1.42c-.52 0-.89.28-.89.9v1.42h2.3l-.33 2.3H13V22h-3.13v-9.04H8.34V8.34h1.53V6.52c0-1.61 1-2.52 3.13-2.52h1.86v2.3h-1.1c-.54.02-.91.2-.91.89v1.15Z" />
    </svg>
)

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center w-full px-4">
        <Card className="mx-auto max-w-sm w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BookOpenCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">EdTech AI Hub</CardTitle>
            <CardDescription>
              Enter your email to log in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/dashboard">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
            
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline">
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Google
                </Button>
                <Button variant="outline">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                </Button>
                <Button variant="outline">
                    <MetaIcon className="mr-2 h-4 w-4" />
                    Meta
                </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Developed by Kariuki James Kariuki</p>
        <p>0718845847 | jamexkarix583@gmail.com</p>
      </footer>
    </div>
  )
}
