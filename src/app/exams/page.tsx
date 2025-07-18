
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Bot, FileQuestion, Loader2, Sparkles, Upload, MoreVertical, BrainCircuit, Computer, Pencil, Play, Clock, Award, BookOpen, Target, TrendingUp, Star, Download, Eye, Share2, Calendar, Users, GraduationCap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getGeneratedQuestions, getExamExplanation, getGradeExam } from "@/lib/actions";
import { subjects, exams } from "@/lib/mock-data";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel } from "@/components/ui/alert-dialog";
import type { GenerateExamQuestionsOutput } from "@/ai/flows/generate-exam-questions";
import type { GradeExamOutput } from "@/ai/flows/grade-exam";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const questionGeneratorSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  numQuestions: z.coerce.number().int().min(1, "Please generate at least 1 question.").max(10, "You can generate a maximum of 10 questions."),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
});

const examsBySubject = exams.reduce((acc, exam) => {
    (acc[exam.subject as keyof typeof acc] = acc[exam.subject as keyof typeof acc] || []).push(exam);
    return acc;
}, {} as Record<string, typeof exams>);

const questionTypeOptions = [
    { id: "Multiple Choice", label: "Multiple Choice" },
    { id: "Short Answer", label: "Short Answer" },
    { id: "True/False", label: "True/False" },
]

export default function ExamsRevisionPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isExplanationPending, startExplanationTransition] = useTransition();
    const [isGradingPending, startGradingTransition] = useTransition();

    const [generatedQuestions, setGeneratedQuestions] = useState<GenerateExamQuestionsOutput['questions'] | null>(null);
    const [examExplanation, setExamExplanation] = useState<string | null>(null);
    const [selectedExam, setSelectedExam] = useState<{title: string, subject: string} | null>(null);
    const [gradingResults, setGradingResults] = useState<GradeExamOutput | null>(null);

    const { toast } = useToast();
    const { theme, curriculum, curriculumInfo } = useCurriculumTheme();

    const form = useForm<z.infer<typeof questionGeneratorSchema>>({
        resolver: zodResolver(questionGeneratorSchema),
        defaultValues: {
            topic: "",
            numQuestions: 5,
            questionTypes: ["Multiple Choice", "Short Answer"],
        }
    });

    function onQuestionSubmit(values: z.infer<typeof questionGeneratorSchema>) {
        setGeneratedQuestions(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("subject", values.subject);
            formData.append("topic", values.topic);
            formData.append("numQuestions", values.numQuestions.toString());
            values.questionTypes.forEach(qt => formData.append("questionTypes", qt));
            
            const result = await getGeneratedQuestions(formData);

            if (result.error) {
                toast({ variant: "destructive", title: "Error", description: result.error });
            } else {
                setGeneratedQuestions(result.questions ?? null);
            }
        });
    }

    async function handleAnalyzeExam(exam: {title: string, subject: string}) {
        setExamExplanation(null);
        setSelectedExam(exam);
        startExplanationTransition(async () => {
            const formData = new FormData();
            formData.append("subject", exam.subject);
            formData.append("examTitle", exam.title);
            const result = await getExamExplanation(formData);
            if(result.error) {
                toast({ variant: "destructive", title: "AI Analysis Failed", description: result.error });
                setSelectedExam(null);
            } else {
                setExamExplanation(result.explanation ?? "Could not get an explanation.");
            }
        });
    }

    async function handleGradeExam(exam: {title: string, subject: string}) {
        setGradingResults(null);
        setSelectedExam(exam);
        startGradingTransition(async () => {
            const formData = new FormData();
            formData.append("subject", exam.subject);
            formData.append("examTitle", exam.title);
            const result = await getGradeExam(formData);
            if(result.error) {
                toast({ variant: "destructive", title: "AI Grading Failed", description: result.error });
            } else {
                setGradingResults(result.results ?? null);
            }
        });
    }

    const handleSystemMarking = () => {
        toast({ title: "System Marking", description: "This feature is coming soon!" });
    }

    const handleManualMarking = () => {
        toast({ title: "Manual Marking", description: "Please refer to the answer key provided by your instructor." });
    }


    return (
        <AppShell title="Exams & Revision">
            {/* Hero Section with Statistics */}
            <div className="relative mb-8">
                <div 
                    className="rounded-xl p-8 text-white relative overflow-hidden"
                    style={{
                        background: theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)'
                    }}
                >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Exams & Revision
                                </h1>
                                <p className="text-white/90 text-lg">
                                    Access {curriculum || 'your'} curriculum exams, practice tests, and AI-powered study tools
                                </p>
                                {curriculumInfo && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                            <GraduationCap className="h-3 w-3 mr-1" />
                                            {curriculumInfo.name}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:block">
                                <Award className="h-16 w-16 text-white/60" />
                            </div>
                        </div>
                        
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="h-8 w-8 text-white/80" />
                                    <div>
                                        <div className="text-2xl font-bold">{exams.length}</div>
                                        <div className="text-sm text-white/80">Available Exams</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Target className="h-8 w-8 text-white/80" />
                                    <div>
                                        <div className="text-2xl font-bold">{subjects.length}</div>
                                        <div className="text-sm text-white/80">Subjects</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-8 w-8 text-white/80" />
                                    <div>
                                        <div className="text-2xl font-bold">24/7</div>
                                        <div className="text-sm text-white/80">AI Support</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Star className="h-8 w-8 text-white/80" />
                                    <div>
                                        <div className="text-2xl font-bold">95%</div>
                                        <div className="text-sm text-white/80">Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="library" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="library" className="text-lg py-3">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Exam Library
                    </TabsTrigger>
                    <TabsTrigger value="generator" className="text-lg py-3">
                        <Sparkles className="mr-2 h-5 w-5" />
                        AI Question Generator
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="p-3 rounded-lg"
                                        style={{
                                            background: theme ? `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)` : 'linear-gradient(135deg, hsl(var(--primary))/20, hsl(var(--secondary))/20)'
                                        }}
                                    >
                                        <Play className="h-6 w-6" style={{ color: theme?.primary || 'hsl(var(--primary))' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Take Quick Test</h3>
                                        <p className="text-sm text-muted-foreground">Start a practice exam</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="p-3 rounded-lg"
                                        style={{
                                            background: theme ? `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)` : 'linear-gradient(135deg, hsl(var(--primary))/20, hsl(var(--secondary))/20)'
                                        }}
                                    >
                                        <TrendingUp className="h-6 w-6" style={{ color: theme?.primary || 'hsl(var(--primary))' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">View Progress</h3>
                                        <p className="text-sm text-muted-foreground">Track your performance</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="p-3 rounded-lg"
                                                style={{
                                                    background: theme ? `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)` : 'linear-gradient(135deg, hsl(var(--primary))/20, hsl(var(--secondary))/20)'
                                                }}
                                            >
                                                <Upload className="h-6 w-6" style={{ color: theme?.primary || 'hsl(var(--primary))' }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Upload Exam</h3>
                                                <p className="text-sm text-muted-foreground">Add your own exam</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Exam Document</DialogTitle>
                                    <DialogDescription>
                                        Upload a PDF or document file. This feature is for demonstration purposes.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Input id="exam-file" type="file" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Exam Library */}
                    <Card className="border-2">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl">Exam Library</CardTitle>
                                    <CardDescription className="text-lg">Browse official exams and practice tests for your curriculum</CardDescription>
                                </div>
                                <Badge variant="outline" className="px-3 py-1">
                                    {Object.keys(examsBySubject).length} Subjects • {exams.length} Exams
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {Object.entries(examsBySubject).map(([subject, subjectExams]) => {
                                    const subjectInfo = subjects.find(s => s.title === subject);
                                    const Icon = subjectInfo?.Icon;
                                    return (
                                    <AccordionItem value={subject} key={subject}>
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                {Icon && <Icon className="h-5 w-5" />}
                                                <span>{subject}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Topic</TableHead>
                                                        <TableHead>Exam Title</TableHead>
                                                        <TableHead>ISO ID</TableHead>
                                                        <TableHead>Duration</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {subjectExams.map((exam) => (
                                                        <TableRow key={exam.id}>
                                                            <TableCell>{exam.topic}</TableCell>
                                                            <TableCell className="font-medium">
                                                                <button 
                                                                    onClick={() => router.push(`/exams/${exam.id}`)}
                                                                    className="text-left hover:text-primary hover:underline transition-colors"
                                                                >
                                                                    {exam.title}
                                                                </button>
                                                            </TableCell>
                                                            <TableCell><Badge variant="secondary">{exam.isoId}</Badge></TableCell>
                                                            <TableCell>{exam.duration}</TableCell>
                                                            <TableCell className="text-right space-x-2">
                                                                <Button 
                                                                    variant="default" 
                                                                    size="sm" 
                                                                    onClick={() => router.push(`/exams/${exam.id}`)}
                                                                >
                                                                    <Play className="mr-2 h-4 w-4" /> Take Exam
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleAnalyzeExam(exam)}>
                                                                    <Bot className="mr-2 h-4 w-4" /> Analyze
                                                                </Button>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            Mark Exam <MoreVertical className="ml-2 h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuItem onClick={() => handleGradeExam(exam)}>
                                                                            <BrainCircuit className="mr-2 h-4 w-4" /> Mark with AI
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={handleSystemMarking}>
                                                                            <Computer className="mr-2 h-4 w-4" /> System Marking
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={handleManualMarking}>
                                                                            <Pencil className="mr-2 h-4 w-4" /> Manual Marking
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionContent>
                                    </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="generator">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generate Practice Questions</CardTitle>
                                <CardDescription>Let AI create a custom practice test for you.</CardDescription>
                            </CardHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onQuestionSubmit)}>
                                    <CardContent className="space-y-4">
                                        <FormField control={form.control} name="subject" render={({ field }) => (
                                            <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="topic" render={({ field }) => (
                                            <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., The Causes of World War I" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="numQuestions" render={({ field }) => (
                                            <FormItem><FormLabel>Number of Questions</FormLabel><FormControl><Input type="number" min="1" max="10" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField
                                            control={form.control}
                                            name="questionTypes"
                                            render={() => (
                                                <FormItem>
                                                    <div className="mb-4">
                                                        <FormLabel className="text-base">Question Types</FormLabel>
                                                        <FormDescription>Select the types of questions you want.</FormDescription>
                                                    </div>
                                                    {questionTypeOptions.map((item) => (
                                                        <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="questionTypes"
                                                        render={({ field }) => {
                                                            return (
                                                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                            (value) => value !== item.id
                                                                            )
                                                                        )
                                                                    }}
                                                                />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                            )
                                                        }}
                                                        />
                                                    ))}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={isPending}>
                                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Questions</>}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>AI-Generated Questions</CardTitle>
                                <CardDescription>Your generated practice test will appear here.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-6">
                                {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                                {!isPending && !generatedQuestions && (
                                    <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                                        <FileQuestion className="mx-auto h-12 w-12" />
                                        <p className="mt-2">Fill out the form to generate questions.</p>
                                    </div>
                                )}
                                {generatedQuestions && (
                                    <div className="space-y-6">
                                        {generatedQuestions.map((q, index) => (
                                            <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
                                                <p><strong>{index + 1}. {q.questionText}</strong> ({q.questionType})</p>
                                                {q.options && q.options.length > 0 && (
                                                    <ul className="list-disc pl-5 my-2 space-y-1">
                                                        {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                                    </ul>
                                                )}
                                                <p className="text-primary"><strong>Answer:</strong> {q.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!(selectedExam && !gradingResults)} onOpenChange={(open) => !open && setSelectedExam(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2"><Bot /> AI Analysis: {selectedExam?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Here's what our AI thinks about this exam.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-4">
                        {isExplanationPending && <div className="flex items-center justify-center h-full min-h-[200px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                        {!isExplanationPending && examExplanation && (
                           <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                                {examExplanation}
                            </div>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedExam(null)}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog open={!!gradingResults} onOpenChange={(open) => !open && setGradingResults(null)}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2"><BrainCircuit /> AI Grading Results: {selectedExam?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Here's the AI's assessment of the exam.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-4">
                        {isGradingPending && <div className="flex items-center justify-center h-full min-h-[200px]"><Loader2 className="h-8 w-8 animate-spin text-primary" />Grading in progress...</div>}
                        {!isGradingPending && gradingResults && (
                           <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg">Score: <span className="text-primary">{gradingResults.score}%</span></h3>
                                </div>
                               <div>
                                    <h3 className="font-semibold text-lg">Feedback</h3>
                                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">{gradingResults.feedback}</div>
                               </div>
                               <div>
                                    <h3 className="font-semibold text-lg">Answer Key</h3>
                                     <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">{gradingResults.answerKey}</div>
                               </div>
                           </div>
                        )}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setGradingResults(null)}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </AppShell>
    );
}
