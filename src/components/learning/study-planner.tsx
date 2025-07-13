"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Timer,
  Calendar,
  TrendingUp,
  Users,
  Star
} from "lucide-react"

interface StudySession {
  id: string
  subject: string
  topic: string
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  notes: string
  goals: string[]
  completed: boolean
}

interface StudyPlan {
  id: string
  title: string
  description: string
  subjects: string[]
  duration: number // in weeks
  dailyGoal: number // in minutes
  weeklyGoals: string[]
  currentWeek: number
  progress: number
}

interface StudyPlannerProps {
  studyPlans: StudyPlan[]
  recentSessions: StudySession[]
  onCreateSession: (session: Omit<StudySession, 'id' | 'startTime'>) => void
  onCreatePlan: (plan: Omit<StudyPlan, 'id' | 'currentWeek' | 'progress'>) => void
}

export function StudyPlanner({ 
  studyPlans, 
  recentSessions, 
  onCreateSession, 
  onCreatePlan 
}: StudyPlannerProps) {
  const [activeSession, setActiveSession] = useState<StudySession | null>(null)
  const [sessionTime, setSessionTime] = useState(0) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessionNotes, setSessionNotes] = useState('')
  const [sessionGoals, setSessionGoals] = useState<string[]>([''])
  const [newSessionSubject, setNewSessionSubject] = useState('')
  const [newSessionTopic, setNewSessionTopic] = useState('')

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && activeSession) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, activeSession])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = () => {
    if (!newSessionSubject || !newSessionTopic) return

    const session: StudySession = {
      id: Date.now().toString(),
      subject: newSessionSubject,
      topic: newSessionTopic,
      startTime: new Date(),
      duration: 0,
      notes: '',
      goals: sessionGoals.filter(goal => goal.trim()),
      completed: false
    }
    
    setActiveSession(session)
    setIsRunning(true)
    setSessionTime(0)
  }

  const pauseSession = () => {
    setIsRunning(!isRunning)
  }

  const endSession = () => {
    if (activeSession) {
      const completedSession = {
        ...activeSession,
        endTime: new Date(),
        duration: Math.floor(sessionTime / 60),
        notes: sessionNotes,
        goals: sessionGoals.filter(goal => goal.trim()),
        completed: true
      }
      
      onCreateSession(completedSession)
      setActiveSession(null)
      setIsRunning(false)
      setSessionTime(0)
      setSessionNotes('')
      setSessionGoals([''])
      setNewSessionSubject('')
      setNewSessionTopic('')
    }
  }

  const addGoal = () => {
    setSessionGoals([...sessionGoals, ''])
  }

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...sessionGoals]
    newGoals[index] = value
    setSessionGoals(newGoals)
  }

  const removeGoal = (index: number) => {
    setSessionGoals(sessionGoals.filter((_, i) => i !== index))
  }

  const getTotalStudyTime = () => {
    return recentSessions.reduce((total, session) => total + session.duration, 0)
  }

  const getStudyStreak = () => {
    // Calculate consecutive days with study sessions
    const today = new Date()
    let streak = 0
    let currentDate = new Date(today)
    
    while (true) {
      const dayStart = new Date(currentDate)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(23, 59, 59, 999)
      
      const hasSessionToday = recentSessions.some(session => 
        session.startTime >= dayStart && session.startTime <= dayEnd
      )
      
      if (hasSessionToday) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  return (
    <div className="space-y-6">
      {/* Study Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Study Timer
          </CardTitle>
          <CardDescription>
            Track your focused study sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!activeSession ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={newSessionSubject}
                    onChange={(e) => setNewSessionSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Topic</label>
                  <Input
                    placeholder="e.g., Calculus"
                    value={newSessionTopic}
                    onChange={(e) => setNewSessionTopic(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Session Goals</label>
                {sessionGoals.map((goal, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="What do you want to achieve?"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                    />
                    {sessionGoals.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeGoal(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addGoal}>
                  Add Goal
                </Button>
              </div>
              
              <Button 
                onClick={startSession} 
                disabled={!newSessionSubject || !newSessionTopic}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Study Session
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div>
                <div className="text-4xl font-mono font-bold text-primary mb-2">
                  {formatTime(sessionTime)}
                </div>
                <div className="text-lg font-medium">{activeSession.subject}</div>
                <div className="text-muted-foreground">{activeSession.topic}</div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={pauseSession} variant="outline">
                  {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button onClick={endSession} variant="destructive">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
              
              <div className="text-left space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Session Notes</label>
                  <Textarea
                    placeholder="What did you learn? Any insights or questions?"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Study Plans</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Study Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getTotalStudyTime()}m</div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getStudyStreak()}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{recentSessions.length}</div>
                    <div className="text-sm text-muted-foreground">Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Sessions</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{session.subject}</div>
                        <div className="text-sm text-muted-foreground">{session.topic}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{session.duration}m</div>
                      <div className="text-sm text-muted-foreground">
                        {session.startTime.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentSessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No study sessions yet. Start your first session above!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {/* Study Plans */}
          <div className="grid gap-4">
            {studyPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge variant="outline">Week {plan.currentWeek}/{plan.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(plan.progress)}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {plan.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Daily Goal:</span> {plan.dailyGoal} minutes
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {plan.duration} weeks
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {studyPlans.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">No study plans yet</p>
                  <Button>Create Your First Study Plan</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Detailed History */}
          <Card>
            <CardHeader>
              <CardTitle>Study History</CardTitle>
              <CardDescription>Complete log of your study sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{session.subject} - {session.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.startTime.toLocaleString()} • {session.duration} minutes
                        </p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    
                    {session.goals.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-2">Session Goals:</h5>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {session.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {session.notes && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Notes:</h5>
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
