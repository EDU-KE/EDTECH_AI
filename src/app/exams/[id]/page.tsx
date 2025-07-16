"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  Timer,
  User,
  Calendar
} from "lucide-react";
import { exams } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

// Mock exam questions data
const examQuestions = {
  'm1': [ // Algebra I Final
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Solve for x: 2x + 5 = 15',
      options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 12.5'],
      correctAnswer: 'x = 5',
      points: 10
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'What is the slope of the line y = 3x + 2?',
      options: ['2', '3', '5', '1'],
      correctAnswer: '3',
      points: 10
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Factor the expression: x² - 9',
      correctAnswer: '(x + 3)(x - 3)',
      points: 15
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'If f(x) = 2x - 1, what is f(4)?',
      options: ['7', '8', '9', '6'],
      correctAnswer: '7',
      points: 10
    },
    {
      id: 'q5',
      type: 'short-answer',
      question: 'Solve the quadratic equation: x² - 5x + 6 = 0',
      correctAnswer: 'x = 2, x = 3',
      points: 20
    }
  ],
  'm2': [ // Geometry Mid-term
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is the area of a circle with radius 5?',
      options: ['25π', '10π', '5π', '50π'],
      correctAnswer: '25π',
      points: 10
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'The sum of angles in a triangle is:',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: '180°',
      points: 10
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Find the hypotenuse of a right triangle with legs of length 3 and 4.',
      correctAnswer: '5',
      points: 15
    }
  ],
  's1': [ // Biology Basics Quiz
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'],
      correctAnswer: 'Mitochondria',
      points: 10
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Which process do plants use to make food?',
      options: ['Respiration', 'Photosynthesis', 'Digestion', 'Circulation'],
      correctAnswer: 'Photosynthesis',
      points: 10
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Name the four bases found in DNA.',
      correctAnswer: 'Adenine, Thymine, Guanine, Cytosine',
      points: 15
    }
  ],
  's2': [ // Periodic Table Test
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What is the chemical symbol for Gold?',
      options: ['Go', 'Au', 'Ag', 'Gd'],
      correctAnswer: 'Au',
      points: 10
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'How many protons does Carbon have?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '6',
      points: 10
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'What is the atomic number of Oxygen?',
      correctAnswer: '8',
      points: 10
    }
  ],
  'h1': [ // World War II Exam
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'World War II began in which year?',
      options: ['1938', '1939', '1940', '1941'],
      correctAnswer: '1939',
      points: 10
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Which countries were part of the Axis Powers?',
      options: ['Germany, Italy, Japan', 'Germany, Russia, Italy', 'Germany, France, Japan', 'Italy, Japan, Britain'],
      correctAnswer: 'Germany, Italy, Japan',
      points: 15
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'Describe the significance of D-Day in World War II.',
      correctAnswer: 'D-Day was the Allied invasion of Normandy on June 6, 1944, which opened a second front in Europe.',
      points: 20
    }
  ],
  'e1': [ // Shakespeare's Hamlet Analysis
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Who is the protagonist of Hamlet?',
      options: ['Claudius', 'Hamlet', 'Polonius', 'Laertes'],
      correctAnswer: 'Hamlet',
      points: 10
    },
    {
      id: 'q2',
      type: 'short-answer',
      question: 'What is the significance of the famous "To be or not to be" soliloquy?',
      correctAnswer: 'It explores themes of existence, suicide, and the human condition.',
      points: 20
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: 'How does Hamlet\'s relationship with Ophelia develop throughout the play?',
      correctAnswer: 'Their relationship deteriorates as Hamlet becomes obsessed with revenge and feigns madness.',
      points: 25
    }
  ]
};

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const examId = params.id as string;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const exam = exams.find(e => e.id === examId);
  const questions = examQuestions[examId as keyof typeof examQuestions] || [];

  useEffect(() => {
    if (!exam) {
      toast({
        variant: "destructive",
        title: "Exam not found",
        description: "The requested exam could not be found."
      });
      router.push('/exams');
      return;
    }

    // Initialize timer based on exam duration
    const durationMinutes = parseInt(exam.duration.split(' ')[0]);
    setTimeRemaining(durationMinutes * 60);
  }, [exam, router, toast]);

  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
    
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        earnedPoints += question.points;
      }
    });
    
    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    
    toast({
      title: "Exam Submitted!",
      description: `You scored ${percentage}% (${earnedPoints}/${totalPoints} points)`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        earnedPoints += question.points;
      }
    });
    
    return { earnedPoints, totalPoints, percentage: Math.round((earnedPoints / totalPoints) * 100) };
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  if (showResults) {
    const { earnedPoints, totalPoints, percentage } = calculateScore();
    
    return (
      <AppShell title="Exam Results">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {percentage >= 70 ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : (
                  <AlertCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {percentage >= 70 ? 'Congratulations!' : 'Keep Studying!'}
              </CardTitle>
              <CardDescription>
                {exam.title} - {exam.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
                <div className="text-lg text-muted-foreground">{earnedPoints}/{totalPoints} points</div>
                <Progress value={percentage} className="h-3 mt-4" />
              </div>

              <div className="grid gap-4">
                <h3 className="font-semibold text-lg">Question Review</h3>
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Question {index + 1} ({question.points} points)</p>
                          <p className="text-sm text-muted-foreground mb-2">{question.question}</p>
                          
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Your answer:</span>{' '}
                              {userAnswer || 'No answer provided'}
                            </p>
                            <p>
                              <span className="font-medium">Correct answer:</span>{' '}
                              {question.correctAnswer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => router.push('/exams')} className="flex-1">
                  Back to Exams
                </Button>
                <Button 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setIsSubmitted(false);
                    setShowResults(false);
                    const durationMinutes = parseInt(exam.duration.split(' ')[0]);
                    setTimeRemaining(durationMinutes * 60);
                  }} 
                  variant="outline" 
                  className="flex-1"
                >
                  Retake Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <AppShell title={exam.title}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Exam Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {exam.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {exam.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {exam.duration}
                  </span>
                </CardDescription>
              </div>
              {timeRemaining !== null && (
                <div className="flex items-center gap-2 text-lg font-mono">
                  <Timer className="h-5 w-5" />
                  <span className={timeRemaining < 300 ? 'text-red-600' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
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
              <Badge variant="outline">{currentQuestion.type}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{currentQuestion.points} points</span>
              </div>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'multiple-choice' ? (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Enter your answer here..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="min-h-[100px]"
              />
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={handleNext}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
