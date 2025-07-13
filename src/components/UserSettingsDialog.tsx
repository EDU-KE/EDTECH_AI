"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"
import { deleteUserAccount } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Trash2, 
  AlertTriangle,
  Settings as SettingsIcon 
} from "lucide-react"

interface UserSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserSettingsDialog({ open, onOpenChange }: UserSettingsDialogProps) {
  const { user, profile, isDemoMode } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteUserAccount()
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      })
      router.push("/")
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Delete Account Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (!user || !profile) return null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Account Settings
            </DialogTitle>
            <DialogDescription>
              Manage your account details and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Display Name
                    </label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.displayName}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Role
                    </label>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={profile.role === 'teacher' ? 'default' : 'secondary'}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Created
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(profile.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {isDemoMode && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Demo Mode:</strong> This is a demo account. Profile changes are not persisted.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Actions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Account Actions
                </CardTitle>
                <CardDescription>
                  Manage your account settings and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Edit Profile</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Change Password</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email Preferences</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Danger Zone</span>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. This will permanently delete your account and remove all your data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure you want to delete your account? This action cannot be undone.
              
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">This will permanently:</p>
                <ul className="text-sm text-destructive mt-1 list-disc list-inside space-y-1">
                  <li>Delete your account and profile</li>
                  <li>Remove all your learning data</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Delete your study progress</li>
                </ul>
              </div>

              {isDemoMode && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> Account deletion will only sign you out.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
