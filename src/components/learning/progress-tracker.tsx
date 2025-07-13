"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Star,
  Award
} from "lucide-react"

interface LearningGoal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline: Date
  category: string
  priority: 'low' | 'medium' | 'high'
}

interface Achievement {
  id: string
  title: string
  description: string
  earnedAt: Date
  type: 'milestone' | 'streak' | 'completion' | 'excellence'
  points: number
}

interface ProgressTrackerProps {
  goals: LearningGoal[]
  achievements: Achievement[]
  totalXP: number
  currentLevel: number
  nextLevelXP: number
  studyStreak: number
}

export function ProgressTracker({
  goals,
  achievements,
  totalXP,
  currentLevel,
  nextLevelXP,
  studyStreak
}: ProgressTrackerProps) {
  const levelProgress = ((totalXP % 1000) / 1000) * 100 // Assuming 1000 XP per level

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'milestone': return Trophy
      case 'streak': return Target
      case 'completion': return BookOpen
      case 'excellence': return Award
      default: return Star
    }
  }

  const formatTimeRemaining = (deadline: Date) => {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Due today'
    if (days === 1) return '1 day left'
    return `${days} days left`
  }

  return (
    <div className="space-y-6">
      {/* Level and XP Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Learning Progress
              </CardTitle>
              <CardDescription>
                Track your learning journey and achievements
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">Level {currentLevel}</div>
              <div className="text-sm text-muted-foreground">{totalXP} XP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <div className="text-xs text-muted-foreground mt-1">
              {nextLevelXP - (totalXP % 1000)} XP needed for next level
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 mx-auto">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{studyStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2 mx-auto">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{achievements.length}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2 mx-auto">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{goals.filter(g => (g.current / g.target) >= 1).length}</div>
              <div className="text-xs text-muted-foreground">Goals Completed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2 mx-auto">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{Math.round(totalXP / 10)}</div>
              <div className="text-xs text-muted-foreground">Hours Studied</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Goals
          </CardTitle>
          <CardDescription>
            Your current learning objectives and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100)
              const isCompleted = progress >= 100
              const timeRemaining = formatTimeRemaining(goal.deadline)
              
              return (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getPriorityColor(goal.priority)} className="text-xs">
                        {goal.priority}
                      </Badge>
                      {isCompleted && (
                        <Badge variant="outline" className="text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {timeRemaining}
                      </span>
                      <span>{Math.round(progress)}% complete</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>
            Your latest learning milestones and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.slice(0, 5).map((achievement) => {
              const Icon = getAchievementIcon(achievement.type)
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">
                      +{achievement.points} XP
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.earnedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
            
            {achievements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No achievements yet. Keep learning to earn your first badge!</p>
              </div>
            )}
          </div>
          
          {achievements.length > 5 && (
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
