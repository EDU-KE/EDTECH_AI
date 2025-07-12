
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { subjects, libraryBooks } from "@/lib/mock-data"
import { Upload } from "lucide-react"

const bookSchema = z.object({
  title: z.string().min(3, "Title is required."),
  author: z.string().min(3, "Author is required."),
  subject: z.string({ required_error: "Please select a subject." }),
  category: z.string({ required_error: "Please select a category." }),
  imageUrl: z.string().url("Please enter a valid image URL."),
  previewContent: z.string().min(20, "Preview content must be at least 20 characters."),
})

const examSchema = z.object({
    subject: z.string({ required_error: "Please select a subject." }),
    topic: z.string().min(3, "Topic is required."),
    title: z.string().min(5, "Title is required."),
    duration: z.string().min(3, "Duration is required."),
})

export default function AdminPage() {
    const { toast } = useToast()

    const bookForm = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            author: "",
            imageUrl: "",
            previewContent: "",
        },
    })

    const examForm = useForm<z.infer<typeof examSchema>>({
        resolver: zodResolver(examSchema),
        defaultValues: {
            topic: "",
            title: "",
            duration: "60 min",
        },
    })

    function onBookSubmit(values: z.infer<typeof bookSchema>) {
        console.log("Submitting Book:", values)
        toast({
            title: "Upload Successful!",
            description: `The book "${values.title}" has been added to the library.`,
        })
        bookForm.reset()
    }

    function onExamSubmit(values: z.infer<typeof examSchema>) {
        console.log("Submitting Exam:", values)
        toast({
            title: "Upload Successful!",
            description: `The exam "${values.title}" has been added.`,
        })
        examForm.reset()
    }

  return (
    <AppShell title="Admin Panel">
        <Tabs defaultValue="books">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto md:mx-0">
                <TabsTrigger value="books">Manage Books</TabsTrigger>
                <TabsTrigger value="exams">Manage Exams</TabsTrigger>
            </TabsList>
            <TabsContent value="books">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Book</CardTitle>
                        <CardDescription>Fill in the details below to add a new book to the library.</CardDescription>
                    </CardHeader>
                    <Form {...bookForm}>
                        <form onSubmit={bookForm.handleSubmit(onBookSubmit)}>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                     <FormField control={bookForm.control} name="title" render={({ field }) => (
                                        <FormItem><FormLabel>Book Title</FormLabel><FormControl><Input placeholder="e.g., A Global Approach to Biology" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={bookForm.control} name="author" render={({ field }) => (
                                        <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="e.g., Campbell et al." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={bookForm.control} name="subject" render={({ field }) => (
                                        <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={bookForm.control} name="category" render={({ field }) => (
                                        <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{[...new Set(libraryBooks.map(b => b.category))].map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={bookForm.control} name="imageUrl" render={({ field }) => (
                                        <FormItem><FormLabel>Cover Image URL</FormLabel><FormControl><Input placeholder="https://placehold.co/400x600.png" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={bookForm.control} name="previewContent" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>Book Preview Content</FormLabel><FormControl><Textarea placeholder="Paste a few paragraphs from the book..." className="flex-1 resize-y min-h-[200px] md:min-h-0" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit"><Upload className="mr-2 h-4 w-4" /> Upload Book</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="exams">
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Upload New Exam</CardTitle>
                        <CardDescription>Fill in the details to add a new exam or practice test.</CardDescription>
                    </CardHeader>
                     <Form {...examForm}>
                        <form onSubmit={examForm.handleSubmit(onExamSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField control={examForm.control} name="title" render={({ field }) => (
                                    <FormItem><FormLabel>Exam Title</FormLabel><FormControl><Input placeholder="e.g., Algebra I Final" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={examForm.control} name="subject" render={({ field }) => (
                                    <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={examForm.control} name="topic" render={({ field }) => (
                                    <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., Algebra" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={examForm.control} name="duration" render={({ field }) => (
                                    <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g., 90 min" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit"><Upload className="mr-2 h-4 w-4" /> Upload Exam</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
        </Tabs>
    </AppShell>
  )
}
