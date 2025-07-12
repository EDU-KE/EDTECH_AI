
"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChevronsLeft, ChevronsRight, FileQuestion, Loader2, MonitorPlay, Sparkles, FolderClock, BookCopy, ChevronDown, CheckCircle } from "lucide-react"

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
    const { toast } = useToast()

    const form = useForm<z.infer<typeof setupSchema>>({
        resolver: zodResolver(setupSchema),
        defaultValues: { topic: "", grade: "Grade 10" },
    })

    function onSubmit(values: z.infer<typeof setupSchema>) {
        setPresentation(null)
        setCurrentSlide(0)
        setShowQuestions(false)
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
        toast({ title: "Session Loaded", description: `Loaded "${session.title}"`});
    }

    return (
        <AppShell title="Live Class Session">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="h-[calc(100vh-10rem)] flex flex-col">
                        <CardHeader>
                            <CardTitle>Classroom View</CardTitle>
                            {presentation ? (
                                <div className="flex justify-between items-center">
                                    <CardDescription>
                                        Session: {presentation.title}
                                    </CardDescription>
                                     <Badge variant="outline">ISO: {presentation.isoId}</Badge>
                                </div>
                            ) : (
                                <CardDescription>Your presentation will appear here once generated.</CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center bg-muted/50 rounded-lg m-6 mt-0">
                           {isPending && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
                           {!isPending && !presentation && (
                                <div className="text-center text-muted-foreground">
                                    <MonitorPlay className="h-16 w-16 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Ready to Teach?</h3>
                                    <p>Fill out the setup form to start your class.</p>
                                </div>
                           )}
                           {presentation && !showQuestions && (
                                <div className="w-full h-full flex flex-col justify-between p-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary mb-4">{presentation.slides[currentSlide].title}</h2>
                                        <ul className="space-y-3 list-disc pl-5">
                                            {presentation.slides[currentSlide].content.map((point, i) => (
                                                <li key={i} className="text-lg">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Button variant="outline" onClick={handlePrevSlide} disabled={currentSlide === 0}><ChevronsLeft className="mr-2 h-4 w-4" /> Previous</Button>
                                        <span className="text-sm text-muted-foreground">Slide {currentSlide + 1} of {presentation.slides.length}</span>
                                        {currentSlide === presentation.slides.length - 1 ? (
                                            <Button onClick={() => setShowQuestions(true)}><FileQuestion className="mr-2 h-4 w-4" /> Show Questions</Button>
                                        ) : (
                                            <Button onClick={handleNextSlide}>Next <ChevronsRight className="ml-2 h-4 w-4" /></Button>
                                        )}
                                    </div>
                                </div>
                           )}
                           {presentation && showQuestions && (
                                <ScrollArea className="w-full h-full p-8">
                                    <div className="w-full flex flex-col">
                                        <h2 className="text-2xl font-bold text-primary mb-4">Quiz Time!</h2>
                                        <div className="space-y-6">
                                            {presentation.questions.map((q, index) => (
                                                <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
                                                    <p><strong>{index + 1}. {q.questionText}</strong></p>
                                                    <p className="text-primary"><strong>Answer:</strong> {q.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="outline" onClick={() => setShowQuestions(false)} className="mt-auto self-start">Back to Presentation</Button>
                                    </div>
                                </ScrollArea>
                           )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
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
            </div>
        </AppShell>
    )
}
