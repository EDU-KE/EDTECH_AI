"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Brain, 
  Target,
  ArrowRight,
  RotateCcw,
  Lightbulb
} from "lucide-react"

interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'multi-select'
  question: string
  options: string[]
  correctAnswers: string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  questions: QuizQuestion[]
  timeLimit?: number // in minutes
  passingScore: number
}

interface InteractiveQuizProps {
  quiz: Quiz
  onComplete: (score: number, answers: Record<string, string[]>) => void
  onExit?: () => void
}

export function InteractiveQuiz({ quiz, onComplete, onExit }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null)
  const [showExplanation, setShowExplanation] = useState<string | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Timer effect
  React.useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleComplete()
    }
  }, [timeRemaining, isCompleted])

  const handleAnswerChange = (questionId: string, answer: string, isMultiSelect = false) => {
    setAnswers(prev => {
      if (isMultiSelect) {
        const currentAnswers = prev[questionId] || []
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter(a => a !== answer)
          : [...currentAnswers, answer]
        return { ...prev, [questionId]: newAnswers }
      } else {
        return { ...prev, [questionId]: [answer] }
      }
    })
  }

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].length > 0
  }

  const calculateScore = () => {
    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach(question => {
      totalPoints += question.points
      const userAnswers = answers[question.id] || []
      const correctAnswers = question.correctAnswers

      if (question.type === 'multi-select') {
        // For multi-select, all correct answers must be selected and no incorrect ones
        const isCorrect = 
          userAnswers.length === correctAnswers.length &&
          userAnswers.every(answer => correctAnswers.includes(answer))
        if (isCorrect) earnedPoints += question.points
      } else {
        // For single answer questions
        if (userAnswers.length === 1 && correctAnswers.includes(userAnswers[0])) {
          earnedPoints += question.points
        }
      }
    })

    return Math.round((earnedPoints / totalPoints) * 100)
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowExplanation(null)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowExplanation(null)
    }
  }

  const handleComplete = () => {
    const score = calculateScore()
    setIsCompleted(true)
    setShowResults(true)
    onComplete(score, answers)
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsCompleted(false)
    setShowResults(false)
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null)
    setShowExplanation(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (showResults) {
    const score = calculateScore()
    const passed = score >= quiz.passingScore

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <Target className="h-10 w-10 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </CardTitle>
          <CardDescription>
            You scored {score}% on {quiz.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
            <Progress value={score} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              Passing score: {quiz.passingScore}%
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Question Review</h3>
            {quiz.questions.map((question, index) => {
              const userAnswers = answers[question.id] || []
              const isCorrect = question.type === 'multi-select'
                ? userAnswers.length === question.correctAnswers.length &&
                  userAnswers.every(answer => question.correctAnswers.includes(answer))
                : userAnswers.length === 1 && question.correctAnswers.includes(userAnswers[0])

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Question {index + 1}</p>
                      <p className="text-sm text-muted-foreground mb-2">{question.question}</p>
                      
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Your answer:</span>{' '}
                          {userAnswers.length > 0 ? userAnswers.join(', ') : 'No answer'}
                        </p>
                        <p>
                          <span className="font-medium">Correct answer:</span>{' '}
                          {question.correctAnswers.join(', ')}
                        </p>
                      </div>
                      
                      {question.explanation && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <Lightbulb className="h-4 w-4 inline mr-1 text-blue-600" />
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleRestart} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={onExit} className="flex-1">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            {timeRemaining && (
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="h-5 w-5" />
                <span className={timeRemaining < 300 ? 'text-red-600' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={`${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              {currentQuestion.points} points
            </div>
          </div>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false' ? (
            <RadioGroup
              value={answers[currentQuestion.id]?.[0] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                Select all correct answers:
              </p>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${index}`}
                    checked={answers[currentQuestion.id]?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleAnswerChange(currentQuestion.id, option, true)
                      } else {
                        setAnswers(prev => ({
                          ...prev,
                          [currentQuestion.id]: (prev[currentQuestion.id] || []).filter(a => a !== option)
                        }))
                      }
                    }}
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {showExplanation === currentQuestion.id && currentQuestion.explanation && (
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                  <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestion.explanation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(
                showExplanation === currentQuestion.id ? null : currentQuestion.id
              )}
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              {showExplanation === currentQuestion.id ? 'Hide' : 'Show'} Hint
            </Button>
          )}
        </div>

        <Button
          onClick={currentQuestionIndex === totalQuestions - 1 ? handleComplete : handleNext}
          disabled={!isQuestionAnswered(currentQuestion.id)}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Complete Quiz' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
