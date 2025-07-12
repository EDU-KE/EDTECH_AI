
"use client";

import { useState, useTransition, Suspense } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, FileSignature, BookCopy, FolderClock } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getSummary, getClassNotes } from "@/lib/actions";
import { subjects, libraryBooks } from "@/lib/mock-data";

const ResultCard = dynamic(() => import('@/components/result-card').then(mod => mod.ResultCard), {
    loading: () => <div className="flex items-center justify-center h-full min-h-[300px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>,
    ssr: false,
});


const summarySchema = z.object({
  notes: z.string().min(20, "Please enter at least 20 characters to summarize."),
});

const notesSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
});

const libraryNotesSchema = z.object({
    bookId: z.string({ required_error: "Please select a book." }),
});

const mockSavedNotes = "### Saved Biology Notes: Photosynthesis\n\n1.  **Definition**: The process used by plants, algae, and some bacteria to convert light energy into chemical energy.\n2.  **Equation**: 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2\n3.  **Stages**: Light-dependent reactions and the Calvin Cycle (light-independent reactions).";

export default function NotesAssistantPage() {
  const [isSummaryPending, startSummaryTransition] = useTransition();
  const [isNotesPending, startNotesTransition] = useTransition();
  
  const [result, setResult] = useState<string | null>(null);
  const [isShowingSaved, setIsShowingSaved] = useState(false);
  
  const { toast } = useToast();

  const summaryForm = useForm<z.infer<typeof summarySchema>>({
    resolver: zodResolver(summarySchema),
    defaultValues: { notes: "" },
  });

  const notesForm = useForm<z.infer<typeof notesSchema>>({
    resolver: zodResolver(notesSchema),
    defaultValues: { topic: "" },
  });

  const libraryNotesForm = useForm<z.infer<typeof libraryNotesSchema>>({
    resolver: zodResolver(libraryNotesSchema),
  });


  function onSummarySubmit(values: z.infer<typeof summarySchema>) {
    setResult(null);
    setIsShowingSaved(false);
    startSummaryTransition(async () => {
      const formData = new FormData();
      formData.append("notes", values.notes);
      const res = await getSummary(formData);
      if (res.error) toast({ variant: "destructive", title: "Error", description: res.error });
      else setResult(res.summary ?? null);
    });
  }

  function onNotesSubmit(values: z.infer<typeof notesSchema>) {
    setResult(null);
    setIsShowingSaved(false);
    startNotesTransition(async () => {
        const formData = new FormData();
        formData.append("subject", values.subject);
        formData.append("topic", values.topic);
        const res = await getClassNotes(formData);
        if (res.error) toast({ variant: "destructive", title: "Error", description: res.error });
        else setResult(res.notes ?? null);
    });
  }
  
  function onLibraryNotesSubmit(values: z.infer<typeof libraryNotesSchema>) {
    setResult(null);
    setIsShowingSaved(false);
    const selectedBook = libraryBooks.find(b => b.id === values.bookId);
    if (!selectedBook) {
        toast({ variant: "destructive", title: "Error", description: "Selected book not found." });
        return;
    }

    startNotesTransition(async () => {
        const formData = new FormData();
        formData.append("subject", selectedBook.subject);
        formData.append("topic", `Notes for "${selectedBook.title}"`);
        formData.append("bookContent", selectedBook.previewContent);
        const res = await getClassNotes(formData);
        if (res.error) toast({ variant: "destructive", title: "Error", description: res.error });
        else setResult(res.notes ?? null);
    });
  }

  function handleViewSaved() {
    setIsShowingSaved(true);
    setResult(null);
  }

  const isPending = isSummaryPending || isNotesPending;

  return (
    <AppShell title="AI Notes Assistant">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <Tabs defaultValue="summarize">
                <CardHeader>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summarize">Summarize Notes</TabsTrigger>
                        <TabsTrigger value="generate">Generate by Topic</TabsTrigger>
                        <TabsTrigger value="library">Generate from Book</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <TabsContent value="summarize">
                    <Form {...summaryForm}>
                        <form onSubmit={summaryForm.handleSubmit(onSummarySubmit)}>
                        <CardContent>
                             <CardDescription className="mb-4">Paste your notes below and let AI create a concise summary for you.</CardDescription>
                            <FormField control={summaryForm.control} name="notes" render={({ field }) => (
                                <FormItem><FormLabel>Your Notes</FormLabel><FormControl><Textarea placeholder="Paste your notes here..." className="resize-y min-h-[300px]" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSummaryPending}><>
                                {isSummaryPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Summarize Notes
                            </></Button>
                        </CardFooter>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="generate">
                    <Form {...notesForm}>
                        <form onSubmit={notesForm.handleSubmit(onNotesSubmit)}>
                        <CardContent className="space-y-4">
                             <CardDescription className="mb-4">Select a subject and topic to generate comprehensive class notes.</CardDescription>
                            <FormField control={notesForm.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={notesForm.control} name="topic" render={({ field }) => (
                                <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., The Cold War" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                        <CardFooter>
                           <Button type="submit" disabled={isNotesPending}><>
                                {isNotesPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookCopy className="mr-2 h-4 w-4" />}
                                Generate Notes
                            </></Button>
                        </CardFooter>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="library">
                    <Form {...libraryNotesForm}>
                        <form onSubmit={libraryNotesForm.handleSubmit(onLibraryNotesSubmit)}>
                        <CardContent className="space-y-4">
                             <CardDescription className="mb-4">Select a book from the library to generate detailed notes from its content.</CardDescription>
                            <FormField control={libraryNotesForm.control} name="bookId" render={({ field }) => (
                                <FormItem><FormLabel>Library Book</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a book" /></SelectTrigger></FormControl><SelectContent>{libraryBooks.map(b => (<SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                        <CardFooter>
                           <Button type="submit" disabled={isNotesPending}><>
                                {isNotesPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookCopy className="mr-2 h-4 w-4" />}
                                Generate from Book
                            </></Button>
                        </CardFooter>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </Card>
        
        <Suspense fallback={<Card><CardContent className="flex items-center justify-center h-full min-h-[300px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>}>
            <ResultCard 
                title="AI-Generated Output" 
                description="Your summary or notes will appear here." 
                content={isShowingSaved ? mockSavedNotes : result} 
                isPending={isPending}
                headerAction={
                    <Button variant="outline" size="sm" onClick={handleViewSaved}>
                        <FolderClock className="mr-2 h-4 w-4" /> Saved Notes
                    </Button>
                }
            />
        </Suspense>
      </div>
    </AppShell>
  );
}
