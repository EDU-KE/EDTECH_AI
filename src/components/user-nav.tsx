
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
import { useAuth } from "@/contexts/AuthContext"
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
  const { user, profile, isDemoMode, loading } = useAuth()
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

  // Hide if not authenticated
  if (!user || !profile) {
    return null
  }

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
                <AvatarImage src={user.photoURL || undefined} alt={`@${profile.displayName}`} />
                <AvatarFallback className="text-xs font-medium">
                  {getInitials(profile.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">
                  {profile.displayName}
                </span>
                <span className="text-xs text-muted-foreground leading-none">
                  {profile.role}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-72 sm:w-80" align="end" forceMount>
          {/* User Info Header */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-start gap-3 p-2">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src={user.photoURL || undefined} alt={`@${profile.displayName}`} />
                <AvatarFallback className="text-sm font-medium">
                  {getInitials(profile.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none truncate">{profile.displayName}</p>
                  <Badge variant={profile.role === 'teacher' ? 'default' : 'secondary'} className="text-xs shrink-0">
                    {profile.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{profile.email}</span>
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
              <Link href="/dashboard" className="flex items-center">
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
                {profile.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Member since:</span>
              <span>{new Date(profile.createdAt).getFullYear()}</span>
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
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <UserSettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </>
  )
}
