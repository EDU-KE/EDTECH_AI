
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { UserSettingsDialog } from "./UserSettingsDialog"
import { 
  User, 
  Settings, 
  LogOut, 
  Shield,
  Mail,
  ChevronDown
} from "lucide-react"

export function UserNav() {
  const { user, isDemoMode, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showSettings, setShowSettings] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive"
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="hidden sm:block">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  // Always show user nav - either for authenticated users or as a sign-in prompt
  // Set up display data - use actual user if available, otherwise show sign-in option
  const displayUser = user || {
    uid: 'guest-user',
    email: 'guest@example.com',
    displayName: 'Sign In',
    photoURL: null,
    role: 'guest' as const,
    createdAt: new Date()
  }

  const isAuthenticated = !!user

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 px-2 sm:px-3 rounded-full bg-background/50 border border-border/50 hover:bg-background/80">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                {isAuthenticated ? (
                  <>
                    <AvatarImage src={displayUser.photoURL || undefined} alt={`@${displayUser.displayName}`} />
                    <AvatarFallback className="text-xs font-medium">
                      {getInitials(displayUser.displayName)}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="text-xs font-medium">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">
                  {isAuthenticated ? displayUser.displayName : "Sign In"}
                </span>
                <span className="text-xs text-muted-foreground leading-none">
                  {isAuthenticated ? displayUser.role : "Not signed in"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72 sm:w-80" align="end" forceMount>
          {isAuthenticated ? (
            <>
              {/* User Info Header */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-start gap-3 p-2">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={displayUser.photoURL || undefined} alt={`@${displayUser.displayName}`} />
                    <AvatarFallback className="text-sm font-medium">
                      {getInitials(displayUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none truncate">{displayUser.displayName}</p>
                      <Badge variant={displayUser.role === 'teacher' ? 'default' : 'secondary'} className="text-xs shrink-0">
                        {displayUser.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{displayUser.email}</span>
                    </div>
                    {isDemoMode && (
                      <Badge variant="outline" className="text-xs">
                        Demo Account
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              {/* Account Actions */}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Account Details Quick View */}
              <div className="px-3 py-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Account Type:</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {displayUser.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Member since:</span>
                  <span>{displayUser.createdAt ? new Date(displayUser.createdAt).getFullYear() : new Date().getFullYear()}</span>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Logout */}
              <DropdownMenuItem 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {/* Sign In Prompt */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-start gap-3 p-2">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarFallback className="text-sm font-medium">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none">Welcome to EdTech AI</p>
                    <p className="text-xs text-muted-foreground">Sign in to access your account</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              {/* Sign In Options */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Create Account</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog - only for authenticated users */}
      {isAuthenticated && (
        <UserSettingsDialog 
          open={showSettings} 
          onOpenChange={setShowSettings} 
        />
      )}
    </>
  )
}
