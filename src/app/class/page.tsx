
"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChevronsLeft, ChevronsRight, FileQuestion, Loader2, MonitorPlay, Sparkles, FolderClock, BookCopy, ChevronDown, CheckCircle, Users, Clock, Play, Pause, RotateCcw, Settings, Maximize2, Volume2, Camera, Mic, Share2, MessageCircle, Hand, Award, Target, TrendingUp, BookOpen, Presentation, Timer, Lightbulb, Activity } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { libraryBooks, subjects, savedClassSessions } from "@/lib/mock-data"
import { getPresentation } from "@/lib/actions"
import type { GeneratePresentationOutput } from "@/ai/flows/generate-presentation"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const setupSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  topic: z.string().min(3, "Topic is required."),
  grade: z.string().min(1, "Grade is required"),
  bookId: z.string({ required_error: "Please select a source book." }),
})

const groupedSavedSessions = savedClassSessions.reduce((acc, session) => {
    const key = `${session.subject} - ${session.grade}`;
    if (!acc[key]) {
        acc[key] = [];
    }
    acc[key].push(session);
    return acc;
}, {} as Record<string, typeof savedClassSessions>);

export default function ClassPage() {
    const [isPending, startTransition] = useTransition()
    const [presentation, setPresentation] = useState<GeneratePresentationOutput | null>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showQuestions, setShowQuestions] = useState(false)
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
    const [sessionDuration, setSessionDuration] = useState(0)
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [classNotes, setClassNotes] = useState("")
    const [studentCount, setStudentCount] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [slideProgress, setSlideProgress] = useState(0)
    const [interactiveMode, setInteractiveMode] = useState(false)
    const [showParticipants, setShowParticipants] = useState(false)
    const { toast } = useToast()
    const { theme, curriculum, curriculumInfo } = useCurriculumTheme()

    // Session timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isSessionActive && sessionStartTime) {
            interval = setInterval(() => {
                const now = Date.now()
                const elapsed = Math.floor((now - sessionStartTime.getTime()) / 1000)
                setSessionDuration(elapsed)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isSessionActive, sessionStartTime])

    // Auto-advance slide progress
    useEffect(() => {
        if (isSessionActive && presentation) {
            const progress = ((currentSlide + 1) / presentation.slides.length) * 100
            setSlideProgress(progress)
        }
    }, [currentSlide, presentation, isSessionActive])

    const startSession = useCallback(() => {
        setIsSessionActive(true)
        setSessionStartTime(new Date())
        setStudentCount(Math.floor(Math.random() * 25) + 5) // Simulate 5-30 students
        toast({ 
            title: "🎯 Live Session Started!", 
            description: `${curriculum === '8-4-4' ? '📚 8-4-4 System' : 'Interactive'} class session is now live`,
            duration: 3000
        })
    }, [curriculum, toast])

    const endSession = useCallback(() => {
        setIsSessionActive(false)
        setSessionStartTime(null)
        setSessionDuration(0)
        setIsRecording(false)
        toast({ 
            title: "Session Ended", 
            description: "Class session has been successfully ended",
            duration: 3000
        })
    }, [toast])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const form = useForm<z.infer<typeof setupSchema>>({
        resolver: zodResolver(setupSchema),
        defaultValues: { topic: "", grade: "Grade 10" },
    })

    function onSubmit(values: z.infer<typeof setupSchema>) {
        setPresentation(null)
        setCurrentSlide(0)
        setShowQuestions(false)
        setSlideProgress(0)
        startTransition(async () => {
            const formData = new FormData();
            const book = libraryBooks.find(b => b.id === values.bookId);
            if (!book) {
                toast({ variant: "destructive", title: "Book not found" });
                return;
            }
            formData.append("subject", values.subject)
            formData.append("topic", values.topic)
            formData.append("bookContent", book.previewContent)
            
            const result = await getPresentation(formData);
            if (result.error) {
                toast({ variant: "destructive", title: "AI Error", description: result.error })
            } else {
                setPresentation(result.presentation ?? null);
                toast({ 
                    title: "🎉 Presentation Ready!", 
                    description: `${curriculum === '8-4-4' ? '📚 8-4-4 System' : 'Interactive'} lesson generated successfully`,
                    duration: 3000
                })
            }
        })
    }
    
    const handleNextSlide = () => {
        if (presentation && currentSlide < presentation.slides.length - 1) {
            setCurrentSlide(currentSlide + 1)
        }
    }
    
    const handlePrevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1)
        }
    }

    const handleLoadSession = (session: GeneratePresentationOutput) => {
        setPresentation(session);
        setCurrentSlide(0);
        setShowQuestions(false);
        setSlideProgress(0);
        toast({ 
            title: "📚 Session Loaded", 
            description: `Loaded "${session.title}" - Ready to start live class!`,
            duration: 3000
        });
    }

    return (
        <AppShell title="Live Class Session">
            {/* Enhanced Header with Session Status */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${theme?.secondary || 'bg-gray-100'} border ${theme?.border || 'border-gray-200'}`}>
                            <Presentation className={`h-6 w-6 ${theme?.accent || 'text-gray-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${theme?.accent || 'text-gray-900'}`}>
                                {curriculum === '8-4-4' ? '📚 8-4-4 Live Class' : 'Interactive Live Class'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {curriculumInfo ? `${curriculumInfo.name} Teaching Platform` : 'AI-powered teaching experience'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {curriculum && (
                            <Badge variant="outline" className={`${theme?.badge || 'bg-gray-100'}`}>
                                <div className="text-lg mr-1">{curriculumInfo?.icon}</div>
                                {curriculum}
                            </Badge>
                        )}
                        {isSessionActive && (
                            <Badge variant="default" className={`${theme?.primary || 'bg-green-500'} text-white animate-pulse`}>
                                🔴 LIVE
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Session Controls Bar */}
            {presentation && (
                <Card className={`mb-6 border-2 ${theme?.border || 'border-gray-200'}`}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Timer className={`h-5 w-5 ${theme?.accent || 'text-gray-600'}`} />
                                    <span className="font-mono text-lg">{formatTime(sessionDuration)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className={`h-5 w-5 ${theme?.accent || 'text-gray-600'}`} />
                                    <span>{studentCount} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className={`h-5 w-5 ${theme?.accent || 'text-gray-600'}`} />
                                    <span>Slide {currentSlide + 1}/{presentation.slides.length}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isSessionActive ? (
                                    <Button onClick={startSession} className={`${theme?.primary || 'bg-green-500'} hover:opacity-90 text-white`}>
                                        <Play className="h-4 w-4 mr-2" />
                                        Start Session
                                    </Button>
                                ) : (
                                    <Button onClick={endSession} variant="destructive">
                                        <Pause className="h-4 w-4 mr-2" />
                                        End Session
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setIsRecording(!isRecording)}
                                    className={isRecording ? 'bg-red-50 text-red-600 border-red-200' : ''}
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    {isRecording ? 'Stop Recording' : 'Record'}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Session Progress</span>
                                <Badge variant="outline" className="text-xs">
                                    {Math.round(slideProgress)}%
                                </Badge>
                            </div>
                            <Progress value={slideProgress} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    <Card className={`h-[calc(100vh-20rem)] flex flex-col border-2 ${theme?.border || 'border-gray-200'}`}>
                        <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>
                                        {curriculum === '8-4-4' ? '📚 Classroom View' : '🎯 Interactive Classroom'}
                                    </CardTitle>
                                    {presentation ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <CardDescription>
                                                Session: {presentation.title}
                                            </CardDescription>
                                            <Badge variant="outline" className="text-xs">ISO: {presentation.isoId}</Badge>
                                        </div>
                                    ) : (
                                        <CardDescription>Your presentation will appear here once generated.</CardDescription>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center bg-muted/50 rounded-lg m-6 mt-0">
                           {isPending && (
                                <div className="text-center">
                                    <Loader2 className={`h-12 w-12 animate-spin ${theme?.primary || 'text-blue-500'} mb-4`} />
                                    <p className="text-lg font-medium">Generating AI lesson...</p>
                                    <p className="text-sm text-muted-foreground">Creating interactive content for your class</p>
                                </div>
                           )}
                           {!isPending && !presentation && (
                                <div className="text-center text-muted-foreground">
                                    <div className={`p-6 rounded-full ${theme?.secondary || 'bg-gray-100'} mb-6 inline-block`}>
                                        <MonitorPlay className={`h-20 w-20 ${theme?.accent || 'text-gray-600'}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        {curriculum === '8-4-4' ? '📚 Ready to Teach 8-4-4?' : '🎯 Ready to Teach?'}
                                    </h3>
                                    <p className="text-lg">Fill out the setup form to start your {curriculum === '8-4-4' ? 'traditional curriculum' : 'interactive'} class.</p>
                                    <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                                        <div className="flex flex-col items-center">
                                            <Lightbulb className={`h-8 w-8 ${theme?.accent || 'text-yellow-500'} mb-2`} />
                                            <span>AI-Generated Content</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Users className={`h-8 w-8 ${theme?.accent || 'text-blue-500'} mb-2`} />
                                            <span>Live Interaction</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Target className={`h-8 w-8 ${theme?.accent || 'text-green-500'} mb-2`} />
                                            <span>Progress Tracking</span>
                                        </div>
                                    </div>
                                </div>
                           )}
                           {presentation && !showQuestions && (
                                <div className="w-full h-full flex flex-col justify-between p-8">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className={`text-3xl font-bold ${theme?.accent || 'text-primary'}`}>
                                                {presentation.slides[currentSlide].title}
                                            </h2>
                                            {curriculum === '8-4-4' && (
                                                <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-teal-100 text-green-700 border-green-200">
                                                    📚 8-4-4 System
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="grid gap-4">
                                            {presentation.slides[currentSlide].content.map((point, i) => (
                                                <div key={i} className={`p-4 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-8 h-8 rounded-full ${theme?.primary || 'bg-blue-500'} text-white flex items-center justify-center text-sm font-bold`}>
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-lg leading-relaxed flex-1">{point}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-8 pt-6 border-t">
                                        <Button 
                                            variant="outline" 
                                            onClick={handlePrevSlide} 
                                            disabled={currentSlide === 0}
                                            className="flex items-center gap-2"
                                        >
                                            <ChevronsLeft className="h-4 w-4" /> Previous
                                        </Button>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">
                                                Slide {currentSlide + 1} of {presentation.slides.length}
                                            </span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: presentation.slides.length }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full ${
                                                            i === currentSlide 
                                                                ? theme?.primary || 'bg-blue-500' 
                                                                : 'bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {currentSlide === presentation.slides.length - 1 ? (
                                            <Button 
                                                onClick={() => setShowQuestions(true)}
                                                className={`${theme?.primary || 'bg-gradient-to-r from-green-500 to-teal-500'} hover:opacity-90 text-white`}
                                            >
                                                <FileQuestion className="mr-2 h-4 w-4" /> Show Questions
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={handleNextSlide}
                                                className={`${theme?.primary || 'bg-blue-500'} hover:opacity-90 text-white`}
                                            >
                                                Next <ChevronsRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                           )}
                           {presentation && showQuestions && (
                                <ScrollArea className="w-full h-full p-8">
                                    <div className="w-full flex flex-col">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className={`text-3xl font-bold ${theme?.accent || 'text-primary'}`}>
                                                {curriculum === '8-4-4' ? '📚 Assessment Time!' : '🎯 Quiz Time!'}
                                            </h2>
                                            <Badge variant="outline" className={`${theme?.badge || 'bg-gray-100'}`}>
                                                {presentation.questions.length} Questions
                                            </Badge>
                                        </div>
                                        <div className="space-y-6">
                                            {presentation.questions.map((q, index) => (
                                                <Card key={index} className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
                                                    <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                                                        <CardTitle className="text-lg flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-full ${theme?.primary || 'bg-blue-500'} text-white flex items-center justify-center text-sm font-bold`}>
                                                                {index + 1}
                                                            </div>
                                                            Question {index + 1}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-6">
                                                        <div className="space-y-4">
                                                            <p className="text-lg font-medium">{q.questionText}</p>
                                                            <div className={`p-4 rounded-lg ${theme?.secondary || 'bg-green-50'} border ${theme?.border || 'border-green-200'}`}>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <CheckCircle className={`h-5 w-5 ${theme?.accent || 'text-green-600'}`} />
                                                                    <span className="font-medium">Answer:</span>
                                                                </div>
                                                                <p className="text-lg">{q.answer}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-8 pt-6 border-t">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setShowQuestions(false)}
                                                className="flex items-center gap-2"
                                            >
                                                <BookOpen className="h-4 w-4" /> Back to Presentation
                                            </Button>
                                            <Button 
                                                onClick={endSession}
                                                className={`${theme?.primary || 'bg-gradient-to-r from-green-500 to-teal-500'} hover:opacity-90 text-white`}
                                            >
                                                <Award className="h-4 w-4 mr-2" /> Complete Session
                                            </Button>
                                        </div>
                                    </div>
                                </ScrollArea>
                           )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className={`border-2 ${theme?.border || 'border-gray-200'}`}>
                        <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                            <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>
                                {curriculum === '8-4-4' ? '📚 8-4-4 Session Setup' : '🎯 Session Setup'}
                            </CardTitle>
                            <CardDescription>
                                {curriculum === '8-4-4' 
                                    ? 'Prepare your traditional curriculum lesson with AI assistance' 
                                    : 'Prepare your lesson and let AI generate the materials'
                                }
                            </CardDescription>
                        </CardHeader>
                    <CardHeader>
                        <CardTitle>Session Setup</CardTitle>
                        <CardDescription>Prepare your lesson and let AI generate the materials.</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="subject" render={({ field }) => (
                                    <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="topic" render={({ field }) => (
                                    <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., Introduction to Photosynthesis" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="grade" render={({ field }) => (
                                    <FormItem><FormLabel>Grade</FormLabel><FormControl><Input placeholder="e.g., Grade 10, Form 2" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="bookId" render={({ field }) => (
                                    <FormItem><FormLabel>Source Book</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a library book" /></SelectTrigger></FormControl><SelectContent>{libraryBooks.map(b => (<SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                            <CardFooter className="flex-col gap-2 items-stretch">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate</>}
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline"><FolderClock className="mr-2 h-4 w-4" /> Saved Sessions</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>Saved Class Sessions</DialogTitle>
                                                <DialogDescription>Load a previously generated session to continue teaching.</DialogDescription>
                                            </DialogHeader>
                                            <ScrollArea className="h-[60vh] pr-4">
                                                <Accordion type="multiple" className="w-full space-y-2">
                                                {Object.entries(groupedSavedSessions).map(([groupName, sessions]) => (
                                                    <AccordionItem key={groupName} value={groupName} className="border rounded-lg">
                                                        <AccordionTrigger className="p-4 hover:no-underline text-base font-medium">
                                                            {groupName} ({sessions.length})
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 pt-0">
                                                            <div className="space-y-3">
                                                                {sessions.map(session => (
                                                                    <Card key={session.id} className="hover:bg-muted/50">
                                                                        <CardHeader className="p-4">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <CardTitle className="text-base">{session.title}</CardTitle>
                                                                                    <Badge variant="secondary" className="mt-1">ISO: {session.isoId}</Badge>
                                                                                </div>
                                                                                <DialogClose asChild>
                                                                                    <Button size="sm" onClick={() => handleLoadSession(session)}>
                                                                                        <CheckCircle className="mr-2 h-4 w-4" /> Load
                                                                                    </Button>
                                                                                </DialogClose>
                                                                            </div>
                                                                        </CardHeader>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                                </Accordion>
                                            </ScrollArea>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Button type="button" variant="outline" onClick={() => toast({ title: "Coming soon!", description: "PPTX download will be available in a future update."})}>Download as PowerPoint</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
                
                {/* Session Notes */}
                <Card className={`border-2 ${theme?.border || 'border-gray-200'}`}>
                    <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                        <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>Class Notes</CardTitle>
                        <CardDescription>Take notes during your live session</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Textarea
                            placeholder="Type your class notes here..."
                            value={classNotes}
                            onChange={(e) => setClassNotes(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                    </CardContent>
                </Card>

                {/* Session Analytics */}
                {presentation && (
                    <Card className={`border-2 ${theme?.border || 'border-gray-200'}`}>
                        <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                            <CardTitle className={`${theme?.accent || 'text-gray-900'}`}>Session Analytics</CardTitle>
                            <CardDescription>Real-time session insights</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Activity className={`h-4 w-4 ${theme?.accent || 'text-blue-500'}`} />
                                        <span className="text-sm font-medium">Engagement</span>
                                    </div>
                                    <span className="text-sm font-bold">
                                        {isSessionActive ? Math.floor(Math.random() * 40) + 60 : 0}%
                                    </span>
                                </div>
                                <Progress value={isSessionActive ? Math.floor(Math.random() * 40) + 60 : 0} className="h-2" />
                            </div>
                            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Hand className={`h-4 w-4 ${theme?.accent || 'text-green-500'}`} />
                                        <span className="text-sm font-medium">Participation</span>
                                    </div>
                                    <span className="text-sm font-bold">
                                        {isSessionActive ? Math.floor(Math.random() * 20) + 10 : 0} raised hands
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-lg ${theme?.secondary || 'bg-gray-50'} border ${theme?.border || 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className={`h-4 w-4 ${theme?.accent || 'text-purple-500'}`} />
                                        <span className="text-sm font-medium">Questions</span>
                                    </div>
                                    <span className="text-sm font-bold">
                                        {isSessionActive ? Math.floor(Math.random() * 10) + 2 : 0} pending
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            </div>
        </AppShell>
    )
}
