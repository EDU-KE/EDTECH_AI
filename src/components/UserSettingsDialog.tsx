"use client"

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { deleteUserAccount, updateUserCurriculum, getCurriculumInfo } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Trash2, 
  AlertTriangle,
  Settings as SettingsIcon,
  GraduationCap,
  BookOpen,
  Save,
  Edit,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"

interface UserSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserSettingsDialog({ open, onOpenChange }: UserSettingsDialogProps) {
  const { user, isDemoMode } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security' | 'privacy'>('profile')
  const [userProfile, setUserProfile] = useState<any>(null)
  
  // Curriculum change state
  const [selectedCurriculum, setSelectedCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | ''>('')
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('')
  const [isUpdatingCurriculum, setIsUpdatingCurriculum] = useState(false)
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState(user?.displayName || '')
  
  // Security state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  // Load user profile when dialog opens
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && open) {
        try {
          const { getUserProfile } = await import('@/lib/auth')
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
          if (profile?.curriculum) {
            setSelectedCurriculum(profile.curriculum)
          }
          if (profile?.gradeLevel) {
            setSelectedGradeLevel(profile.gradeLevel)
          }
        } catch (error) {
          console.error('Failed to load user profile:', error)
        }
      }
    }
    loadUserProfile()
  }, [user, open])

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

  const handleUpdateCurriculum = async () => {
    if (!selectedCurriculum) {
      toast({
        title: "Curriculum Required",
        description: "Please select a curriculum",
        variant: "destructive"
      })
      return
    }

    setIsUpdatingCurriculum(true)
    try {
      await updateUserCurriculum(selectedCurriculum, selectedGradeLevel || undefined)
      
      // Reload user profile
      if (user) {
        const { getUserProfile } = await import('@/lib/auth')
        const updatedProfile = await getUserProfile(user.uid)
        setUserProfile(updatedProfile)
      }
      
      toast({
        title: "Curriculum Updated",
        description: `Successfully updated to ${selectedCurriculum}${selectedGradeLevel ? ` - ${selectedGradeLevel}` : ''}`,
      })
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsUpdatingCurriculum(false)
    }
  }

  const handleSaveProfile = async () => {
    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Profile changes are not saved in demo mode",
        variant: "default"
      })
      setIsEditingProfile(false)
      return
    }

    // In a real app, you would update the profile here
    toast({
      title: "Coming Soon",
      description: "Profile editing will be available soon",
      variant: "default"
    })
    setIsEditingProfile(false)
  }

  if (!user) return null

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
        <DialogContent className="max-w-sm sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Account Settings
            </DialogTitle>
            <DialogDescription>
              Manage your account details, academic preferences, and privacy settings
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-4 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full sm:w-48 shrink-0">
              <div className="flex sm:flex-col gap-1 p-1 bg-muted rounded-lg">
                <Button
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className="flex-1 sm:w-full justify-start text-sm h-9"
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                <Button
                  variant={activeTab === 'academic' ? 'secondary' : 'ghost'}
                  className="flex-1 sm:w-full justify-start text-sm h-9"
                  onClick={() => setActiveTab('academic')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Academic</span>
                </Button>
                <Button
                  variant={activeTab === 'security' ? 'secondary' : 'ghost'}
                  className="flex-1 sm:w-full justify-start text-sm h-9"
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </Button>
                <Button
                  variant={activeTab === 'privacy' ? 'secondary' : 'ghost'}
                  className="flex-1 sm:w-full justify-start text-sm h-9"
                  onClick={() => setActiveTab('privacy')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Privacy</span>
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[65vh]">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile Information
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {isEditingProfile ? 'Cancel' : 'Edit'}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Your personal information and account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          {isEditingProfile ? (
                            <Input
                              id="displayName"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              placeholder="Enter your display name"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{user?.displayName}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user?.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Account Role</Label>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <Badge variant={user?.role === 'teacher' ? 'default' : 'secondary'}>
                              {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Member Since</Label>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isEditingProfile && (
                        <div className="flex gap-2 pt-2">
                          <Button onClick={handleSaveProfile} size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingProfile(false)
                              setEditedName(user?.displayName || '')
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}

                      {isDemoMode && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Demo Mode:</strong> Profile changes are not persisted in demo mode.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'academic' && (
                <div className="space-y-6">
                  {/* Current Curriculum */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Current Curriculum
                      </CardTitle>
                      <CardDescription>
                        Your selected academic curriculum and grade level
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userProfile?.curriculum ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                            <span className="text-2xl">{getCurriculumInfo(userProfile.curriculum)?.icon}</span>
                            <div>
                              <div className="font-medium">{getCurriculumInfo(userProfile.curriculum)?.name}</div>
                              <div className="text-sm text-muted-foreground">{userProfile.curriculum}</div>
                            </div>
                          </div>
                          {userProfile.gradeLevel && (
                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Grade: {userProfile.gradeLevel}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No curriculum selected</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Change Curriculum */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" />
                        Change Curriculum
                      </CardTitle>
                      <CardDescription>
                        Update your curriculum and grade level preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="curriculum">Select Curriculum</Label>
                          <Select value={selectedCurriculum} onValueChange={(value: 'CBE' | '8-4-4' | 'IGCSE') => setSelectedCurriculum(value)}>
                            <SelectTrigger id="curriculum">
                              <SelectValue placeholder="Choose your curriculum" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CBE">
                                <div className="flex items-center gap-2">
                                  <span>🎯</span>
                                  <span>Competency-Based Education (CBE)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="8-4-4">
                                <div className="flex items-center gap-2">
                                  <span>📚</span>
                                  <span>8-4-4 System</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="IGCSE">
                                <div className="flex items-center gap-2">
                                  <span>🌍</span>
                                  <span>IGCSE</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedCurriculum && (
                          <div className="space-y-2">
                            <Label htmlFor="gradeLevel">Grade Level (Optional)</Label>
                            <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
                              <SelectTrigger id="gradeLevel">
                                <SelectValue placeholder="Select your grade level" />
                              </SelectTrigger>
                              <SelectContent>
                                {getCurriculumInfo(selectedCurriculum)?.grades.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {selectedCurriculum && (
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm font-medium mb-1">
                              {getCurriculumInfo(selectedCurriculum)?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getCurriculumInfo(selectedCurriculum)?.description}
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={handleUpdateCurriculum}
                          disabled={!selectedCurriculum || isUpdatingCurriculum}
                          className="w-full"
                        >
                          {isUpdatingCurriculum ? (
                            <>Updating...</>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Update Curriculum
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Password Change */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password & Security
                      </CardTitle>
                      <CardDescription>
                        Manage your account password and security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <Button className="w-full" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Coming Soon
                          </Badge>
                        </Button>
                      </div>

                      {isDemoMode && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Demo Mode:</strong> Password changes are not available in demo mode.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  {/* Privacy Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Privacy Settings
                      </CardTitle>
                      <CardDescription>
                        Control your privacy and data sharing preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="text-sm font-medium">Profile Visibility</div>
                            <div className="text-xs text-muted-foreground">Control who can see your profile</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="text-sm font-medium">Data Export</div>
                            <div className="text-xs text-muted-foreground">Download your account data</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="text-sm font-medium">Email Notifications</div>
                            <div className="text-xs text-muted-foreground">Manage notification preferences</div>
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
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
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
            </AlertDialogDescription>
            
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="text-sm text-destructive font-medium">This will permanently:</div>
              <ul className="text-sm text-destructive mt-1 list-disc list-inside space-y-1">
                <li>Delete your account and profile</li>
                <li>Remove all your learning data</li>
                <li>Cancel any active subscriptions</li>
                <li>Delete your study progress</li>
              </ul>
            </div>

            {isDemoMode && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> Account deletion will only sign you out.
                </div>
              </div>
            )}
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
