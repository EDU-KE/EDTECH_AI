
"use client";

import { notFound, useRouter, useParams } from "next/navigation";
import { useState, useTransition, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Lightbulb, Loader2, BookOpen, Video, Pointer, BotMessageSquare, FileSignature, ArrowRight, Sparkles, ClipboardCheck, BookX, Library, FolderClock, MonitorPlay, ChevronsLeft, ChevronsRight, FileQuestion } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartConfig, exams, getSubjectById, progressData, savedClassSessions, type SavedClassSession } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { getRecommendations, getStudyTips } from "@/lib/actions";
import type { GenerateRecommendationsOutput } from "@/ai/flows/generate-recommendations";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const AlertDialog = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialog), { ssr: false });
const AlertDialogContent = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogContent), { ssr: false });
const AlertDialogHeader = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogHeader), { ssr: false });
const AlertDialogTitle = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogTitle), { ssr: false });
const AlertDialogDescription = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogDescription), { ssr: false });
const AlertDialogFooter = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogFooter), { ssr: false });
const AlertDialogAction = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogAction), { ssr: false });
const AlertDialogCancel = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogCancel), { ssr: false });
const AlertDialogTrigger = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogTrigger), { ssr: false });

const Dialog = dynamic(() => import('@/components/ui/dialog').then(mod => mod.Dialog), { ssr: false });
const DialogContent = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogContent), { ssr: false });
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogHeader), { ssr: false });
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogTitle), { ssr: false });
const DialogDescription = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogDescription), { ssr: false });
const DialogTrigger = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogTrigger), { ssr: false });


const recommendationsFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
});

const resourceIcons = {
    "Article": BookOpen,
    "Video": Video,
    "Interactive Tutorial": Pointer,
    "default": Lightbulb,
}

export default function SubjectPage() {
  const params = useParams<{ id: string }>();
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<GenerateRecommendationsOutput['recommendations'] | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [studyTips, setStudyTips] = useState<string | null>(null);
  const [isTipsPending, startTipsTransition] = useTransition();

  const [sessionDialog, setSessionDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SavedClassSession | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);


  const subject = getSubjectById(params.id as string);
  if (!subject) {
    notFound();
  }

  const handleDeenroll = () => {
    const storedSubjectIds = localStorage.getItem("enrolledSubjects");
    if (storedSubjectIds) {
        let subjectIds: string[] = JSON.parse(storedSubjectIds);
        subjectIds = subjectIds.filter(id => id !== subject.id);
        localStorage.setItem("enrolledSubjects", JSON.stringify(subjectIds));
    }

    toast({
        title: "Successfully De-enrolled",
        description: `You have been removed from the ${subject.title} subject.`,
    });
    router.push("/subjects/my-subjects");
  }
  
  useEffect(() => {
    if (activeTab === 'overview' && !studyTips && !isTipsPending) {
      startTipsTransition(async () => {
          const formData = new FormData();
          formData.append("subject", subject.title);
          const result = await getStudyTips(formData);

          if (result.error) {
              toast({
                  variant: "destructive",
                  title: "AI Tips Error",
                  description: result.error,
              });
          } else {
              setStudyTips(result.tips ?? "No tips available at the moment.");
          }
      });
    }
  }, [activeTab, subject.title, toast, studyTips, isTipsPending]);


  const form = useForm<z.infer<typeof recommendationsFormSchema>>({
    resolver: zodResolver(recommendationsFormSchema),
    defaultValues: {
        topic: ""
    }
  });

  function onSubmit(values: z.infer<typeof recommendationsFormSchema>) {
    setRecommendations(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("subject", subject!.title);
      formData.append("topic", values.topic);
      
      const result = await getRecommendations(formData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        setRecommendations(result.recommendations ?? null);
      }
    });
  }

  type SubjectKey = keyof typeof progressData;
  const subjectProgress = progressData[params.id as SubjectKey];
  const subjectExams = exams.filter(exam => exam.subject === subject.title);
  const subjectSessions = savedClassSessions.filter(session => session.subject === subject.title);

  const handleSelectSession = (session: SavedClassSession) => {
    setSelectedSession(session);
    setCurrentSlide(0);
    setShowQuestions(false);
  }

  const handleNextSlide = () => {
    if (selectedSession && currentSlide < selectedSession.slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
    }
  }

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
    }
  }


  return (
    <AppShell title={subject.title}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-2">
            <TabsList className="grid w-full max-w-lg grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
            </TabsList>
            <Suspense fallback={<Button variant="destructive" size="sm" disabled>De-enroll</Button>}>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <BookX className="mr-2 h-4 w-4" />
                            De-enroll
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to de-enroll?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. You will lose all progress associated with the
                                <strong> {subject.title}</strong> subject. You can re-enroll at any time from the Manage Subjects page.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeenroll}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Suspense>
        </div>
        <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-2">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome to {subject.title}</CardTitle>
                            <CardDescription>{subject.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This is your central hub for {subject.title}. Use the quick actions below or the tabs above to navigate.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Get Started</CardTitle>
                            <CardDescription>Quick actions to jumpstart your learning.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                             <Button size="lg" className="justify-start p-4 h-full" onClick={() => setActiveTab('resources')}>
                                <div className="flex items-center gap-4 text-left">
                                <Lightbulb className="h-6 w-6 shrink-0" />
                                <div>
                                    <p className="font-semibold">Find Resources</p>
                                    <p className="font-normal text-primary-foreground/80">Get AI recommendations</p>
                                </div>
                                </div>
                            </Button>
                            <Button size="lg" asChild variant="secondary" className="justify-start p-4 h-full">
                                <Link href="/tutor">
                                <div className="flex items-center gap-4 text-left">
                                    <BotMessageSquare className="h-6 w-6 shrink-0" />
                                    <div>
                                    <p className="font-semibold">Ask AI Tutor</p>
                                    <p className="font-normal text-secondary-foreground/80">Get answers</p>
                                    </div>
                                </div>
                                </Link>
                            </Button>
                            <Button size="lg" asChild variant="secondary" className="justify-start p-4 h-full">
                                <Link href="/summarizer">
                                <div className="flex items-center gap-4 text-left">
                                    <FileSignature className="h-6 w-6 shrink-0" />
                                    <div>
                                    <p className="font-semibold">Notes Assistant</p>
                                    <p className="font-normal text-secondary-foreground/80">Summarize notes</p>
                                    </div>
                                </div>
                                </Link>
                            </Button>
                            <Button size="lg" variant="secondary" className="justify-start p-4 h-full" onClick={() => setActiveTab('exams')}>
                                <div className="flex items-center gap-4 text-left">
                                <ClipboardCheck className="h-6 w-6 shrink-0" />
                                <div>
                                    <p className="font-semibold">Practice Exams</p>
                                    <p className="font-normal text-secondary-foreground/80">Test your knowledge</p>
                                </div>
                                </div>
                            </Button>
                             <Button size="lg" asChild variant="secondary" className="justify-start p-4 h-full">
                                <Link href="/library">
                                <div className="flex items-center gap-4 text-left">
                                    <Library className="h-6 w-6 shrink-0" />
                                    <div>
                                    <p className="font-semibold">Library Books</p>
                                    <p className="font-normal text-secondary-foreground/80">Browse the collection</p>
                                    </div>
                                </div>
                                </Link>
                            </Button>
                            <Dialog open={sessionDialog} onOpenChange={setSessionDialog}>
                                <DialogTrigger asChild>
                                    <Button size="lg" variant="secondary" className="justify-start p-4 h-full">
                                        <div className="flex items-center gap-4 text-left">
                                            <FolderClock className="h-6 w-6 shrink-0" />
                                            <div>
                                            <p className="font-semibold">Saved Sessions</p>
                                            <p className="font-normal text-secondary-foreground/80">Review past classes</p>
                                            </div>
                                        </div>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Saved Class Sessions for {subject.title}</DialogTitle>
                                        <DialogDescription>Review materials from previous classes for self-study.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
                                        <div className="col-span-1 border-r pr-4 overflow-y-auto">
                                            <h3 className="font-semibold mb-2">Available Sessions</h3>
                                            <div className="space-y-2">
                                                {subjectSessions.length > 0 ? subjectSessions.map(session => (
                                                    <Button key={session.id} variant={selectedSession?.id === session.id ? "secondary" : "ghost"} className="w-full justify-start h-auto py-2 flex-col items-start" onClick={() => handleSelectSession(session)}>
                                                        <span className="font-medium">{session.title}</span>
                                                        <span className="text-xs text-muted-foreground">{session.grade} - {session.isoId}</span>
                                                    </Button>
                                                )) : <p className="text-sm text-muted-foreground">No saved sessions for this subject yet.</p>}
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex flex-col">
                                            {selectedSession ? (
                                                <div className="flex-1 flex flex-col bg-muted/50 rounded-lg">
                                                    {!showQuestions ? (
                                                        <div className="w-full h-full flex flex-col justify-between p-6">
                                                            <div>
                                                                <h2 className="text-xl font-bold text-primary mb-4">{selectedSession.slides[currentSlide].title}</h2>
                                                                <ul className="space-y-3 list-disc pl-5">
                                                                    {selectedSession.slides[currentSlide].content.map((point, i) => (
                                                                        <li key={i} className="text-base">{point}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-4">
                                                                <Button variant="outline" onClick={handlePrevSlide} disabled={currentSlide === 0}><ChevronsLeft className="mr-2 h-4 w-4" /> Previous</Button>
                                                                <span className="text-sm text-muted-foreground">Slide {currentSlide + 1} of {selectedSession.slides.length}</span>
                                                                {currentSlide === selectedSession.slides.length - 1 ? (
                                                                    <Button onClick={() => setShowQuestions(true)}><FileQuestion className="mr-2 h-4 w-4" /> Show Questions</Button>
                                                                ) : (
                                                                    <Button onClick={handleNextSlide}>Next <ChevronsRight className="ml-2 h-4 w-4" /></Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <ScrollArea className="w-full h-full p-6">
                                                            <div className="w-full flex flex-col">
                                                                <h2 className="text-xl font-bold text-primary mb-4">Quiz Time!</h2>
                                                                <div className="space-y-6">
                                                                    {selectedSession.questions.map((q, index) => (
                                                                        <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
                                                                            <p><strong>{index + 1}. {q.questionText}</strong></p>
                                                                            <p className="text-primary"><strong>Answer:</strong> {q.answer}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <Button variant="outline" onClick={() => setShowQuestions(false)} className="mt-auto self-start">Back to Slides</Button>
                                                            </div>
                                                        </ScrollArea>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center bg-muted/50 rounded-lg text-center text-muted-foreground">
                                                    <MonitorPlay className="h-12 w-12 mb-2" />
                                                    <p>Select a session to view the materials.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-primary h-5 w-5" />
                            AI Study Tips
                            </CardTitle>
                            <CardDescription>Recommendations for success in {subject.title}.</CardDescription>
                        </CardHeader>
                        <CardContent className="min-h-[150px] flex items-center justify-center">
                            {isTipsPending && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                            {!isTipsPending && studyTips && (
                                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                                    {studyTips}
                                </div>
                            )}
                            {!isTipsPending && !studyTips && !isTipsPending && (
                                <p className="text-sm text-muted-foreground">Could not load AI tips.</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Upcoming Exams</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setActiveTab('exams')}>
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {subjectExams.length > 0 ? (
                                <ul className="space-y-3">
                                {subjectExams.slice(0, 2).map(exam => (
                                    <li key={exam.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium">{exam.title}</p>
                                        <p className="text-muted-foreground text-xs">{exam.duration}</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setActiveTab('exams')}>Start</Button>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No upcoming exams.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="resources">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Find Learning Resources</CardTitle>
                <CardDescription>Find resources for a specific topic in {subject.title}.</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Photosynthesis, Quadratic Equations"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding...</>
                      ) : (
                        <><Lightbulb className="mr-2 h-4 w-4" /> Get Recommendations</>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Recommended Resources</CardTitle>
                <CardDescription>AI-generated recommendations will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {!isPending && !recommendations && (
                    <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                        <Lightbulb className="mx-auto h-12 w-12" />
                        <p className="mt-2">Enter a topic to see recommendations.</p>
                    </div>
                )}
                {recommendations && (
                    <div className="space-y-4">
                        {recommendations.map((rec, index) => {
                            const Icon = resourceIcons[rec.type as keyof typeof resourceIcons] || resourceIcons.default;
                            return (
                            <Card key={index} className="hover:bg-muted/50">
                              <CardHeader className="flex flex-row items-start gap-4 p-4">
                                <Icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <div className="flex-1">
                                  <Link href={rec.url} target="_blank" rel="noopener noreferrer">
                                    <CardTitle className="text-base hover:underline">{rec.title}</CardTitle>
                                  </Link>
                                  <CardDescription className="text-xs">{rec.type}</CardDescription>
                                  <p className="text-sm mt-2">{rec.description}</p>
                                </div>
                              </CardHeader>
                            </Card>
                        )})}
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
                <CardTitle>Study Calendar</CardTitle>
                <CardDescription>Schedule and track your study sessions for {subject.title}.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learner Progress</CardTitle>
              <CardDescription>Your progress in {subject.title} over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={subjectProgress}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exams">
        <Card>
            <CardHeader>
                <CardTitle>Exams for {subject.title}</CardTitle>
                <CardDescription>Mock tests and quizzes available for this subject.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Exam Title</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {subjectExams.map((exam) => (
                        <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.duration}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm">Start Quiz</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
