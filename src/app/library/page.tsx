
"use client"

import React, { useState, useTransition, Suspense } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getRecommendations, getStudyGuide } from "@/lib/actions"
import { subjects, libraryBooks, type LibraryBook, certifiedMaterials, getMaterialsByGrade } from "@/lib/mock-data"
import type { GenerateRecommendationsOutput } from "@/ai/flows/generate-recommendations"
import type { GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide"
import { ArrowRight, BookOpen, Lightbulb, Loader2, Pointer, Video, BookText, Sparkles, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Dialog = dynamic(() => import('@/components/ui/dialog').then(mod => mod.Dialog), { ssr: false });
const DialogContent = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogContent), { ssr: false });
const DialogDescription = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogDescription), { ssr: false });
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogHeader), { ssr: false });
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogTitle), { ssr: false });

const StudyGuideDialog = dynamic(() => import('@/components/study-guide-dialog'), {
    loading: () => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>,
    ssr: false
});

const booksBySubject = subjects.map(subject => ({
    ...subject,
    books: libraryBooks.filter(book => book.subject === subject.title && book.category === 'Subject Textbooks')
})).filter(subject => subject.books.length > 0);

const referenceBooks = libraryBooks.filter(book => book.category === 'Reference');
const storyBooks = libraryBooks.filter(book => book.category === 'Story Book');

const certifiedMaterialsByGrade = getMaterialsByGrade();

const formSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
});

const resourceIcons = {
    "Article": BookOpen,
    "Video": Video,
    "Interactive Tutorial": Pointer,
    "default": Lightbulb,
}

export default function LibraryPage() {
    const [isPending, startTransition] = useTransition();
    const [isGuidePending, startGuideTransition] = useTransition();

    const [recommendations, setRecommendations] = useState<GenerateRecommendationsOutput['recommendations'] | null>(null);
    const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
    const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);
    const [showStudyGuideDialog, setShowStudyGuideDialog] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: ""
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setRecommendations(null);
        startTransition(async () => {
        const formData = new FormData();
        formData.append("subject", values.subject);
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
    
    function handleGenerateStudyGuide(book: LibraryBook) {
        setStudyGuide(null);
        setShowStudyGuideDialog(true);
        startGuideTransition(async () => {
            const formData = new FormData();
            formData.append("title", book.title);
            formData.append("content", book.previewContent);
            const result = await getStudyGuide(formData);
            if(result.error) {
                toast({ variant: "destructive", title: "AI Study Guide Failed", description: result.error });
                setShowStudyGuideDialog(false);
            } else {
                setStudyGuide(result.guide ?? null);
            }
        });
    }


  return (
    <AppShell title="Library Hub">
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Resource Finder</CardTitle>
                        <CardDescription>Can't find what you're looking for? Let our AI find books, articles, and videos for any topic.</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject.id} value={subject.title}>{subject.title}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="e.g., The Digestive System, World War I"
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
                                <><Lightbulb className="mr-2 h-4 w-4" /> Find Resources</>
                            )}
                            </Button>
                        </CardFooter>
                        </form>
                    </Form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Library Collection</CardTitle>
                        <CardDescription>Explore a curated collection of textbooks, reference materials, and story books.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="subject">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="subject">By Subject</TabsTrigger>
                                <TabsTrigger value="reference">Reference</TabsTrigger>
                                <TabsTrigger value="story">Story Books</TabsTrigger>
                                <TabsTrigger value="kicd">KICD Certified</TabsTrigger>
                            </TabsList>
                            <TabsContent value="subject">
                                <Accordion type="single" collapsible className="w-full">
                                    {booksBySubject.map((subject) => {
                                        const Icon = subject.Icon;
                                        return (
                                        <AccordionItem value={subject.id} key={subject.id}>
                                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                                <div className="flex items-center gap-3">
                                                    {Icon && <Icon className="h-5 w-5" />}
                                                    <span>{subject.title}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    {subject.books.map(book => (
                                                        <BookCard 
                                                            key={book.id} 
                                                            book={book} 
                                                            onPreview={() => setSelectedBook(book)} 
                                                            onAnalyze={() => handleGenerateStudyGuide(book)}
                                                        />
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )})}
                                </Accordion>
                            </TabsContent>
                            <TabsContent value="reference">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {referenceBooks.map(book => (
                                       <BookCard 
                                            key={book.id} 
                                            book={book} 
                                            onPreview={() => setSelectedBook(book)} 
                                            onAnalyze={() => handleGenerateStudyGuide(book)}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="story">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {storyBooks.map(book => (
                                       <BookCard 
                                            key={book.id} 
                                            book={book} 
                                            onPreview={() => setSelectedBook(book)} 
                                            onAnalyze={() => handleGenerateStudyGuide(book)}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                             <TabsContent value="kicd">
                                <Accordion type="single" collapsible className="w-full">
                                    {Object.entries(certifiedMaterialsByGrade).map(([grade, materials]) => (
                                        <AccordionItem value={grade} key={grade}>
                                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                                Grade {grade}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-4">
                                                    {materials.map(material => (
                                                        <Card key={material.isoId} className="hover:bg-muted/50">
                                                            <CardHeader className="p-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <CardTitle className="text-base flex items-center gap-2"><Award className="h-5 w-5 text-amber-500" />{material.title}</CardTitle>
                                                                        <CardDescription>{material.description}</CardDescription>
                                                                    </div>
                                                                    <Badge variant="outline">{material.type}</Badge>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground pt-2">
                                                                    ISO ID: {material.isoId}
                                                                </div>
                                                            </CardHeader>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <Card className="flex flex-col min-h-[300px] lg:min-h-0">
                <CardHeader>
                    <CardTitle>AI Found Resources</CardTitle>
                    <CardDescription>AI-generated recommendations will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                    {!isPending && !recommendations && (
                        <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center p-4">
                            <Lightbulb className="mx-auto h-12 w-12" />
                            <p className="mt-2">Use the AI finder to get resources for any topic.</p>
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

        <Suspense>
            {selectedBook && (
                <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{selectedBook?.title}</DialogTitle>
                            <DialogDescription>
                                By {selectedBook?.author}
                                {selectedBook?.isoId && <span className="block text-xs mt-1">ISO ID: {selectedBook.isoId}</span>}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-3 gap-6 py-4">
                            <div className="md:col-span-1">
                                {selectedBook && (
                                    <Image
                                        src={selectedBook.imageUrl}
                                        alt={selectedBook.title}
                                        width={400}
                                        height={600}
                                        className="rounded-lg object-cover w-full"
                                        data-ai-hint={selectedBook.imageHint}
                                    />
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <BookText className="h-5 w-5" /> Preview
                                </h3>
                                <div className="prose prose-sm max-w-none dark:prose-invert h-96 overflow-auto border rounded-md p-4 bg-muted/50">
                                    {selectedBook?.previewContent}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {showStudyGuideDialog && (
                <StudyGuideDialog
                    open={showStudyGuideDialog}
                    onOpenChange={setShowStudyGuideDialog}
                    isPending={isGuidePending}
                    guide={studyGuide}
                />
            )}
        </Suspense>

    </AppShell>
  )
}

const BookCard = React.memo(function BookCard({ book, onPreview, onAnalyze }: { book: LibraryBook; onPreview: () => void; onAnalyze: () => void; }) {
    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
                 <div className="relative h-48 w-full">
                    <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        className="rounded-t-lg object-cover"
                        data-ai-hint={book.imageHint}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-base line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                {book.isoId && <Badge variant="outline" className="mt-2">ID: {book.isoId}</Badge>}
            </CardContent>
            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button onClick={onPreview} variant="outline" size="sm">
                    Preview <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={onAnalyze} variant="default" size="sm">
                   AI Guide <Sparkles className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
})
