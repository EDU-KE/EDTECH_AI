"use client"

import { NextPage } from 'next'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ProgressTracker } from '@/components/learning/progress-tracker'
import { InteractiveQuiz } from '@/components/learning/interactive-quiz'
import { StudyPlanner } from '@/components/learning/study-planner'
import { LearningResources } from '@/components/learning/learning-resources'
import { AssignmentPlanner } from '@/components/learning/assignment-planner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Target, Clock, Library, GraduationCap } from 'lucide-react'

// Mock data for demonstration
const mockGoals = [
  {
    id: '1',
    title: 'Complete 5 Math exercises',
    description: 'Practice algebra and geometry problems',
    target: 5,
    current: 3,
    unit: 'exercises',
    deadline: new Date('2024-01-20'),
    category: 'mathematics',
    priority: 'high' as const
  },
  {
    id: '2',
    title: 'Study Science for 2 hours',
    description: 'Focus on chemistry concepts',
    target: 120,
    current: 45,
    unit: 'minutes',
    deadline: new Date('2024-01-22'),
    category: 'science',
    priority: 'medium' as const
  }
]

const mockAchievements = [
  {
    id: '1',
    title: 'Quiz Master',
    description: 'Scored 90% or higher on 5 quizzes',
    earnedAt: new Date('2024-01-15'),
    type: 'excellence' as const,
    points: 100
  },
  {
    id: '2',
    title: 'Study Streak',
    description: 'Studied for 7 consecutive days',
    earnedAt: new Date('2024-01-10'),
    type: 'streak' as const,
    points: 50
  }
]

const mockQuiz = {
  id: '1',
  title: 'General Knowledge Quiz',
  description: 'Test your general knowledge across various subjects',
  subject: 'General',
  questions: [
    {
      id: '1',
      type: 'multiple-choice' as const,
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswers: ['Paris'],
      explanation: 'Paris is the capital and largest city of France.',
      difficulty: 'easy' as const,
      points: 10
    },
    {
      id: '2',
      type: 'true-false' as const,
      question: 'The Earth is flat.',
      options: ['True', 'False'],
      correctAnswers: ['False'],
      explanation: 'The Earth is an oblate spheroid, not flat.',
      difficulty: 'easy' as const,
      points: 5
    },
    {
      id: '3',
      type: 'multiple-choice' as const,
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'NaCl', 'O2'],
      correctAnswers: ['H2O'],
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom (H2O).',
      difficulty: 'medium' as const,
      points: 15
    }
  ],
  timeLimit: 5,
  passingScore: 70
}

const mockStudyPlans = [
  {
    id: '1',
    title: 'Mathematics Mastery',
    description: 'Complete algebra and geometry fundamentals',
    subjects: ['Algebra', 'Geometry'],
    duration: 4,
    dailyGoal: 60,
    weeklyGoals: ['Complete 10 algebra problems', 'Study geometry theorems'],
    currentWeek: 2,
    progress: 45
  }
]

const mockStudySessions = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T11:30:00'),
    duration: 90,
    notes: 'Practiced solving quadratic equations using the quadratic formula',
    goals: ['Complete 10 problems', 'Understand discriminant'],
    completed: true
  }
]

const mockResources = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    description: 'A comprehensive guide to understanding the fundamentals of calculus',
    type: 'article' as const,
    subject: 'Mathematics',
    difficulty: 'intermediate' as const,
    duration: '45 min',
    rating: 4.8,
    tags: ['calculus', 'derivatives', 'integrals'],
    author: 'Dr. Sarah Johnson',
    publishedAt: new Date('2024-01-10'),
    downloadable: true,
    free: true
  },
  {
    id: '2',
    title: 'Physics Fundamentals Video Series',
    description: 'Interactive video lessons covering basic physics concepts',
    type: 'video' as const,
    subject: 'Physics',
    difficulty: 'beginner' as const,
    duration: '2 hours',
    rating: 4.6,
    tags: ['mechanics', 'waves', 'energy'],
    author: 'Prof. Michael Chen',
    publishedAt: new Date('2024-01-08'),
    downloadable: false,
    free: false
  },
  {
    id: '3',
    title: 'Chemistry Laboratory Techniques',
    description: 'Essential laboratory skills and safety procedures',
    type: 'document' as const,
    subject: 'Chemistry',
    difficulty: 'advanced' as const,
    duration: '30 min',
    rating: 4.9,
    tags: ['lab-skills', 'safety', 'procedures'],
    author: 'Dr. Emily Rodriguez',
    publishedAt: new Date('2024-01-05'),
    downloadable: true,
    free: true
  }
]

const mockAssignments = [
  {
    id: '1',
    title: 'Algebra Problem Set #3',
    subject: 'Mathematics',
    dueDate: new Date('2024-01-25'),
    priority: 'high' as const,
    completed: false,
    description: 'Complete exercises 1-20 on quadratic equations',
    estimatedHours: 2,
    difficulty: 'medium' as const,
    type: 'homework' as const
  },
  {
    id: '2',
    title: 'Science Project: Solar System',
    subject: 'Physics',
    dueDate: new Date('2024-02-01'),
    priority: 'medium' as const,
    completed: false,
    description: 'Create a model of the solar system with planetary distances to scale',
    estimatedHours: 8,
    difficulty: 'hard' as const,
    type: 'project' as const
  },
  {
    id: '3',
    title: 'History Essay: World War II',
    subject: 'History',
    dueDate: new Date('2024-01-28'),
    priority: 'high' as const,
    completed: true,
    description: 'Write a 1500-word essay on the causes of World War II',
    estimatedHours: 4,
    actualHours: 3.5,
    difficulty: 'medium' as const,
    type: 'homework' as const
  }
]

const mockAssignmentSessions = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Algebra Review',
    duration: 60,
    date: new Date('2024-01-20'),
    notes: 'Reviewed quadratic equations and completed practice problems',
    effectiveness: 4,
    completed: true
  }
]

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History']

const LearningToolsPage: NextPage = () => {
  const handleProgressUpdate = (goalId: string, progress: number) => {
    console.log(`Updating goal ${goalId} progress to ${progress}`)
    // In a real app, this would update the backend
  }

  const handleQuizComplete = (score: number, answers: Record<string, string[]>) => {
    console.log(`Quiz completed: ${score}`, answers)
    // In a real app, this would save results to backend
  }

  const handleCreateSession = (session: any) => {
    console.log('Creating study session:', session)
    // In a real app, this would save session data
  }

  const handleCreatePlan = (plan: any) => {
    console.log('Creating study plan:', plan)
    // In a real app, this would save plan data
  }

  const handleAddAssignment = (assignment: any) => {
    console.log('Adding assignment:', assignment)
    // In a real app, this would save assignment data
  }

  const handleUpdateAssignment = (id: string, updates: any) => {
    console.log('Updating assignment:', id, updates)
    // In a real app, this would update assignment data
  }

  const handleDeleteAssignment = (id: string) => {
    console.log('Deleting assignment:', id)
    // In a real app, this would delete assignment data
  }

  const handleAddStudySession = (session: any) => {
    console.log('Adding study session:', session)
    // In a real app, this would save session data
  }

  const handleResourceClick = (resource: any) => {
    console.log('Resource clicked:', resource)
    // In a real app, this would navigate to the resource or open it
  }

  const handleResourceDownload = (resource: any) => {
    console.log('Resource download:', resource)
    // In a real app, this would trigger download
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Learning Tools</h1>
          <p className="text-muted-foreground">
            Access your personalized learning tools and track your progress
          </p>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
                <CardDescription>
                  Track your learning journey, goals, and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressTracker
                  goals={mockGoals}
                  achievements={mockAchievements}
                  totalXP={1250}
                  currentLevel={5}
                  nextLevelXP={1500}
                  studyStreak={7}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Interactive Quiz
                </CardTitle>
                <CardDescription>
                  Test your knowledge with interactive quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveQuiz
                  quiz={mockQuiz}
                  onComplete={handleQuizComplete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planner">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Planner
                </CardTitle>
                <CardDescription>
                  Plan and track your study sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudyPlanner
                  studyPlans={mockStudyPlans}
                  recentSessions={mockStudySessions}
                  onCreateSession={handleCreateSession}
                  onCreatePlan={handleCreatePlan}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Assignment Planner
                </CardTitle>
                <CardDescription>
                  Manage your assignments and track deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssignmentPlanner
                  assignments={mockAssignments}
                  studySessions={mockAssignmentSessions}
                  subjects={subjects}
                  onAddAssignment={handleAddAssignment}
                  onUpdateAssignment={handleUpdateAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                  onAddStudySession={handleAddStudySession}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <LearningResources
              resources={mockResources}
              subjects={subjects}
              onResourceClick={handleResourceClick}
              onDownload={handleResourceDownload}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

export default LearningToolsPage
