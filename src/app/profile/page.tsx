"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { getCurriculumInfo } from "@/lib/auth"
import { UserSettingsDialog } from "@/components/UserSettingsDialog"
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  BookOpen,
  GraduationCap,
  Settings,
  Edit,
  Award,
  Clock,
  Target,
  TrendingUp,
  ChevronRight
} from "lucide-react"

export default function ProfilePage() {
  const { user, isDemoMode } = useAuth()
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { getUserProfile } = await import('@/lib/auth')
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Failed to load user profile:', error)
        }
      }
    }
    loadUserProfile()
  }, [user])

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login')
    return null
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const curriculumInfo = userProfile?.curriculum ? getCurriculumInfo(userProfile.curriculum) : null

  // Mock data for demonstration - in real app, this would come from your database
  const mockStats = {
    coursesCompleted: 12,
    currentCourses: 3,
    totalStudyHours: 156,
    streak: 7,
    achievements: 8,
    progress: 68
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your learning progress</p>
        </div>
        <Button onClick={() => setShowSettings(true)} className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={user.photoURL || undefined} alt={`@${user.displayName}`} />
                  <AvatarFallback className="text-lg font-medium">
                    {getInitials(user.displayName || 'User')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl">{user.displayName}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </CardDescription>
              </div>
              <div className="flex justify-center">
                <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'} className="capitalize">
                  {user.role}
                </Badge>
              </div>
              {isDemoMode && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Demo Account
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-semibold text-lg">{mockStats.coursesCompleted}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-semibold text-lg">{mockStats.achievements}</div>
                  <div className="text-muted-foreground">Achievements</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{mockStats.progress}%</span>
                </div>
                <Progress value={mockStats.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Study Time</span>
                </div>
                <span className="font-medium">{mockStats.totalStudyHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Current Streak</span>
                </div>
                <span className="font-medium">{mockStats.streak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Active Courses</span>
                </div>
                <span className="font-medium">{mockStats.currentCourses}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your personal account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.displayName}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Your curriculum and academic preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile?.curriculum ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Curriculum</label>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${curriculumInfo?.theme.secondary} border ${curriculumInfo?.theme.border}`}>
                      <span className="text-xl">{curriculumInfo?.icon}</span>
                      <div>
                        <div className={`text-sm font-medium ${curriculumInfo?.theme.accent}`}>{curriculumInfo?.name}</div>
                        <div className="text-xs text-muted-foreground">{userProfile.curriculum}</div>
                      </div>
                    </div>
                  </div>
                  
                  {userProfile.gradeLevel && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Grade Level</label>
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${curriculumInfo?.theme.secondary} border ${curriculumInfo?.theme.border}`}>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{userProfile.gradeLevel}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm font-medium mb-1">No Curriculum Selected</div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Select your curriculum to get personalized learning content
                  </div>
                  <Button onClick={() => setShowSettings(true)} size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Select Curriculum
                  </Button>
                </div>
              )}

              {curriculumInfo && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Available Subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {curriculumInfo.subjects.slice(0, 6).map((subject) => (
                        <Badge key={subject} variant="outline" className={`text-xs ${curriculumInfo.theme.badge}`}>
                          {subject}
                        </Badge>
                      ))}
                      {curriculumInfo.subjects.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{curriculumInfo.subjects.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Key Features</label>
                    <div className="flex flex-wrap gap-2">
                      {curriculumInfo.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className={`text-xs ${curriculumInfo.theme.badge}`}>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest learning milestones and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Mock recent activities */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Completed Mathematics Quiz</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Started Science Chapter 5</div>
                    <div className="text-xs text-muted-foreground">1 day ago</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Earned Achievement Badge</div>
                    <div className="text-xs text-muted-foreground">3 days ago</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Dialog */}
      <UserSettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </div>
  )
}
