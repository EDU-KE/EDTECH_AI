"use client"

import React, { useState, useTransition, Suspense, useEffect } from "react";
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
import { ArrowRight, BookOpen, Lightbulb, Loader2, Pointer, Video, BookText, Sparkles, Award, Filter, Heart, Search, Clock, Star, Users, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Dialog = dynamic(() => import('@/components/ui/dialog').then(mod => mod.Dialog), { ssr: false });
const DialogContent = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogContent), { ssr: false });
const DialogDescription = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogDescription), { ssr: false });
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogHeader), { ssr: false });
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogTitle), { ssr: false });

const StudyGuideDialog = dynamic(() => import('@/components/study-guide-dialog').then(mod => ({ default: mod.StudyGuideDialog })), {
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

// Enhanced search and filtering
interface EnhancedFilters {
    gradeLevel: string;
    difficulty: string;
    category: string;
    author: string;
    showFavoritesOnly: boolean;
}

// Reading history and bookmarks
interface ReadingActivity {
    bookId: string;
    lastRead: Date;
    progress: number;
    isFavorite: boolean;
    rating?: number;
}

export default function LibraryPage() {
    const [isPending, startTransition] = useTransition();
    const [isGuidePending, startGuideTransition] = useTransition();

    const [recommendations, setRecommendations] = useState<GenerateRecommendationsOutput['recommendations'] | null>(null);
    const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
    const [studyGuide, setStudyGuide] = useState<GenerateStudyGuideOutput | null>(null);
    const [showStudyGuideDialog, setShowStudyGuideDialog] = useState(false);
    
    // Enhanced features state
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [filters, setFilters] = useState<EnhancedFilters>({
        gradeLevel: "",
        difficulty: "",
        category: "all",
        author: "",
        showFavoritesOnly: false
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [readingActivity, setReadingActivity] = useState<Map<string, ReadingActivity>>(new Map());

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: ""
        }
    });

    // Enhanced functionality methods
    const toggleFavorite = (bookId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(bookId)) {
                newFavorites.delete(bookId);
                toast({ title: "Removed from favorites", description: "Book removed from your favorites list." });
            } else {
                newFavorites.add(bookId);
                toast({ title: "Added to favorites", description: "Book added to your favorites list." });
            }
            return newFavorites;
        });
    };

    const addToSearchHistory = (searchTerm: string) => {
        setSearchHistory(prev => {
            const newHistory = [searchTerm, ...prev.filter(term => term !== searchTerm)].slice(0, 5);
            return newHistory;
        });
    };

    const filterBooks = (books: LibraryBook[]) => {
        return books.filter(book => {
            if (filters.showFavoritesOnly && !favorites.has(book.id)) return false;
            if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
                !book.author.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (filters.category && filters.category !== "all" && book.category !== filters.category) return false;
            if (filters.author && !book.author.toLowerCase().includes(filters.author.toLowerCase())) return false;
            return true;
        });
    };

    const getBookRating = (bookId: string) => {
        const activity = readingActivity.get(bookId);
        return activity?.rating || 0;
    };

    const updateReadingProgress = (bookId: string, progress: number) => {
        setReadingActivity(prev => {
            const newActivity = new Map(prev);
            const existing = newActivity.get(bookId) || { bookId, lastRead: new Date(), progress: 0, isFavorite: false };
            newActivity.set(bookId, { ...existing, progress, lastRead: new Date() });
            return newActivity;
        });
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        setRecommendations(null);
        addToSearchHistory(`${values.subject}: ${values.topic}`);
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
        {/* Enhanced Search & Filter Bar */}
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Enhanced Search & Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search books, authors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={filters.category || undefined} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value || "" }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Subject Textbooks">Subject Textbooks</SelectItem>
                            <SelectItem value="Reference">Reference</SelectItem>
                            <SelectItem value="Story Book">Story Books</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="favorites-only"
                            checked={filters.showFavoritesOnly}
                            onChange={(e) => setFilters(prev => ({ ...prev, showFavoritesOnly: e.target.checked }))}
                            className="rounded"
                        />
                        <label htmlFor="favorites-only" className="text-sm flex items-center gap-1">
                            <Heart className="h-4 w-4" /> Favorites Only
                        </label>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setFilters({
                                gradeLevel: "",
                                difficulty: "",
                                category: "all",
                                author: "",
                                showFavoritesOnly: false
                            });
                            setSearchTerm("");
                        }}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>
                
                {/* Search History */}
                {searchHistory.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Recent Searches:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {searchHistory.map((term, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        const [subject, topic] = term.split(': ');
                                        form.setValue('subject', subject);
                                        form.setValue('topic', topic);
                                    }}
                                >
                                    {term}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

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
                                            <AccordionContent>                                <div className="grid gap-4 sm:grid-cols-2">
                                    {filterBooks(subject.books).map(book => (
                                        <EnhancedBookCard 
                                            key={book.id} 
                                            book={book} 
                                            onPreview={() => setSelectedBook(book)} 
                                            onAnalyze={() => handleGenerateStudyGuide(book)}
                                            isFavorite={favorites.has(book.id)}
                                            onToggleFavorite={() => toggleFavorite(book.id)}
                                            rating={getBookRating(book.id)}
                                            readingProgress={readingActivity.get(book.id)?.progress || 0}
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
                                    {filterBooks(referenceBooks).map(book => (
                                       <EnhancedBookCard 
                                            key={book.id} 
                                            book={book} 
                                            onPreview={() => setSelectedBook(book)} 
                                            onAnalyze={() => handleGenerateStudyGuide(book)}
                                            isFavorite={favorites.has(book.id)}
                                            onToggleFavorite={() => toggleFavorite(book.id)}
                                            rating={getBookRating(book.id)}
                                            readingProgress={readingActivity.get(book.id)?.progress || 0}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="story">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {filterBooks(storyBooks).map(book => (
                                       <EnhancedBookCard 
                                            key={book.id} 
                                            book={book} 
                                            onPreview={() => setSelectedBook(book)} 
                                            onAnalyze={() => handleGenerateStudyGuide(book)}
                                            isFavorite={favorites.has(book.id)}
                                            onToggleFavorite={() => toggleFavorite(book.id)}
                                            rating={getBookRating(book.id)}
                                            readingProgress={readingActivity.get(book.id)?.progress || 0}
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

const EnhancedBookCard = React.memo(function EnhancedBookCard({ 
    book, 
    onPreview, 
    onAnalyze, 
    isFavorite, 
    onToggleFavorite, 
    rating, 
    readingProgress 
}: { 
    book: LibraryBook; 
    onPreview: () => void; 
    onAnalyze: () => void; 
    isFavorite: boolean; 
    onToggleFavorite: () => void;
    rating: number;
    readingProgress: number;
}) {
    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300 relative">
            {/* Favorite Button */}
            <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                onClick={onToggleFavorite}
            >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>

            <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                    <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        className="rounded-t-lg object-cover"
                        data-ai-hint={book.imageHint}
                    />
                    {/* Reading Progress Bar */}
                    {readingProgress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${readingProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-white text-xs mt-1">{readingProgress}% completed</p>
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-base line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                
                {/* Rating Display */}
                {rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
                    </div>
                )}
                
                {book.isoId && <Badge variant="outline" className="mt-2">ID: {book.isoId}</Badge>}
                
                {/* Social Features */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {Math.floor(Math.random() * 50) + 10} readers
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {Math.floor(Math.random() * 20) + 3} reviews
                    </span>
                </div>
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
