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
  Calendar,
  Clock,
  Plus,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Filter,
  CalendarDays,
  BarChart3
} from "lucide-react"

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  description?: string
  estimatedHours: number
  actualHours?: number
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'homework' | 'project' | 'exam' | 'reading'
}

interface StudySession {
  id: string
  subject: string
  topic: string
  duration: number // in minutes
  date: Date
  notes?: string
  effectiveness: number // 1-5 rating
  completed: boolean
}

interface AssignmentPlannerProps {
  assignments: Assignment[]
  studySessions: StudySession[]
  subjects: string[]
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void
  onUpdateAssignment: (id: string, assignment: Partial<Assignment>) => void
  onDeleteAssignment: (id: string) => void
  onAddStudySession: (session: Omit<StudySession, 'id'>) => void
}

export function AssignmentPlanner({ 
  assignments, 
  studySessions, 
  subjects,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onAddStudySession
}: AssignmentPlannerProps) {
  const [isAddingAssignment, setIsAddingAssignment] = useState(false)
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'subject'>('dueDate')

  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>({
    title: '',
    subject: '',
    dueDate: new Date(),
    priority: 'medium',
    completed: false,
    estimatedHours: 1,
    difficulty: 'medium',
    type: 'homework'
  })

  const [newSession, setNewSession] = useState<Omit<StudySession, 'id'>>({
    subject: '',
    topic: '',
    duration: 60,
    date: new Date(),
    effectiveness: 3,
    completed: false
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'easy': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return '📝'
      case 'project': return '🎯'
      case 'exam': return '📊'
      case 'reading': return '📚'
      default: return '📋'
    }
  }

  const filteredAssignments = assignments
    .filter(assignment => {
      const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'completed' && assignment.completed) ||
        (filterStatus === 'pending' && !assignment.completed) ||
        (filterStatus === 'overdue' && !assignment.completed && new Date(assignment.dueDate) < new Date())
      
      return matchesSubject && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'subject':
          return a.subject.localeCompare(b.subject)
        default:
          return 0
      }
    })

  const completionRate = assignments.length > 0 ? 
    (assignments.filter(a => a.completed).length / assignments.length) * 100 : 0

  const upcomingDeadlines = assignments
    .filter(a => !a.completed)
    .filter(a => {
      const daysUntilDue = Math.ceil((new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilDue <= 7 && daysUntilDue >= 0
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.subject) {
      onAddAssignment(newAssignment)
      setNewAssignment({
        title: '',
        subject: '',
        dueDate: new Date(),
        priority: 'medium',
        completed: false,
        estimatedHours: 1,
        difficulty: 'medium',
        type: 'homework'
      })
      setIsAddingAssignment(false)
    }
  }

  const handleAddSession = () => {
    if (newSession.subject && newSession.topic) {
      onAddStudySession(newSession)
      setNewSession({
        subject: '',
        topic: '',
        duration: 60,
        date: new Date(),
        effectiveness: 3,
        completed: false
      })
      setIsAddingSession(false)
    }
  }

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const isOverdue = daysUntilDue < 0 && !assignment.completed
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && !assignment.completed

    return (
      <Card className={`${assignment.completed ? 'opacity-60' : ''} ${isOverdue ? 'border-red-200 bg-red-50' : ''} ${isDueSoon ? 'border-yellow-200 bg-yellow-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getTypeIcon(assignment.type)}</span>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {assignment.title}
                  {assignment.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                </CardTitle>
                <CardDescription>{assignment.subject}</CardDescription>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateAssignment(assignment.id, { completed: !assignment.completed })}
              >
                {assignment.completed ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteAssignment(assignment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={getPriorityColor(assignment.priority)} variant="outline">
              {assignment.priority} priority
            </Badge>
            <Badge className={getDifficultyColor(assignment.difficulty)} variant="outline">
              {assignment.difficulty}
            </Badge>
            <Badge variant="secondary">
              {assignment.type}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {assignment.dueDate.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {assignment.estimatedHours}h estimated
            </div>
          </div>
          
          {isOverdue && (
            <div className="text-red-600 text-sm font-medium">
              Overdue by {Math.abs(daysUntilDue)} day(s)
            </div>
          )}
          
          {isDueSoon && (
            <div className="text-yellow-600 text-sm font-medium">
              Due in {daysUntilDue} day(s)
            </div>
          )}
          
          {assignment.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {assignment.description}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Assignments</p>
                <p className="text-2xl font-bold">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.completed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Upcoming Deadlines</p>
                <p className="text-2xl font-bold">{upcomingDeadlines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDeadlines.slice(0, 3).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-800">
                    {Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {/* Filters and Add Button */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="subject">Sort by Subject</option>
                  </select>
                </div>
                
                <Button onClick={() => setIsAddingAssignment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assignment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Assignment Form */}
          {isAddingAssignment && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Assignment title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  />
                  
                  <select
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  
                  <Input
                    type="date"
                    value={newAssignment.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: new Date(e.target.value) })}
                  />
                  
                  <select
                    value={newAssignment.priority}
                    onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  
                  <select
                    value={newAssignment.difficulty}
                    onChange={(e) => setNewAssignment({ ...newAssignment, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value as Assignment['type'] })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="homework">Homework</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>
                
                <Input
                  type="number"
                  placeholder="Estimated hours"
                  value={newAssignment.estimatedHours}
                  onChange={(e) => setNewAssignment({ ...newAssignment, estimatedHours: parseFloat(e.target.value) || 1 })}
                />
                
                <Textarea
                  placeholder="Assignment description (optional)"
                  value={newAssignment.description || ''}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                />
                
                <div className="flex gap-2">
                  <Button onClick={handleAddAssignment}>Add Assignment</Button>
                  <Button variant="outline" onClick={() => setIsAddingAssignment(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
          
          {filteredAssignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No assignments found</h3>
                <p className="text-muted-foreground mb-4">
                  {assignments.length === 0 
                    ? "Add your first assignment to get started with planning"
                    : "Try adjusting your filters to see more assignments"
                  }
                </p>
                {assignments.length === 0 && (
                  <Button onClick={() => setIsAddingAssignment(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assignment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Study Sessions
              </CardTitle>
              <CardDescription>
                Track and plan your study sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">Study Sessions Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced study session tracking and analytics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
