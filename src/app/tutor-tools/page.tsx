
"use client";

import { useState, useTransition, Suspense } from "react";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getLessonPlan, getSchemeOfWork } from "@/lib/actions";
import { subjects } from "@/lib/mock-data";

const ResultCard = dynamic(() => import('@/components/result-card').then(mod => mod.ResultCard), {
    loading: () => <Card className="flex flex-col flex-1 min-h-[300px] lg:min-h-0"><CardContent className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>,
    ssr: false,
});

const lessonPlanSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  duration: z.string().min(2, "Please provide a duration."),
  objectives: z.string().min(10, "Please provide learning objectives."),
});

const schemeOfWorkSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  gradeLevel: z.string().min(2, "Please provide a grade level."),
  termDuration: z.string().min(2, "Please provide a term duration."),
});

export default function TutorToolsPage() {
  const [isLessonPlanPending, startLessonPlanTransition] = useTransition();
  const [isSchemePending, startSchemeTransition] = useTransition();
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);
  const [schemeOfWork, setSchemeOfWork] = useState<string | null>(null);
  const { toast } = useToast();

  const lessonPlanForm = useForm<z.infer<typeof lessonPlanSchema>>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: { topic: "", duration: "45 minutes", objectives: "" }
  });

  const schemeOfWorkForm = useForm<z.infer<typeof schemeOfWorkSchema>>({
    resolver: zodResolver(schemeOfWorkSchema),
    defaultValues: { gradeLevel: "10th Grade", termDuration: "12 Weeks" }
  });

  function onLessonPlanSubmit(values: z.infer<typeof lessonPlanSchema>) {
    setLessonPlan(null);
    startLessonPlanTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value as string));
      const result = await getLessonPlan(formData);
      if (result.error) toast({ variant: "destructive", title: "Error", description: result.error });
      else setLessonPlan(result.lessonPlan ?? null);
    });
  }

  function onSchemeOfWorkSubmit(values: z.infer<typeof schemeOfWorkSchema>) {
    setSchemeOfWork(null);
    startSchemeTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value as string));
      const result = await getSchemeOfWork(formData);
      if (result.error) toast({ variant: "destructive", title: "Error", description: result.error });
      else setSchemeOfWork(result.schemeOfWork ?? null);
    });
  }

  return (
    <AppShell title="AI Tutor Tools">
        <Tabs defaultValue="lesson-plan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto md:mx-0">
                <TabsTrigger value="lesson-plan">Lesson Plan Generator</TabsTrigger>
                <TabsTrigger value="scheme-of-work">Scheme of Work Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="lesson-plan">
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate Lesson Plan</CardTitle>
                            <CardDescription>Create a detailed lesson plan for any topic.</CardDescription>
                        </CardHeader>
                        <Form {...lessonPlanForm}>
                            <form onSubmit={lessonPlanForm.handleSubmit(onLessonPlanSubmit)}>
                                <CardContent className="space-y-4">
                                    <FormField control={lessonPlanForm.control} name="subject" render={({ field }) => (
                                        <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={lessonPlanForm.control} name="topic" render={({ field }) => (
                                        <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., Photosynthesis" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={lessonPlanForm.control} name="duration" render={({ field }) => (
                                        <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g., 45 minutes" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={lessonPlanForm.control} name="objectives" render={({ field }) => (
                                        <FormItem><FormLabel>Learning Objectives</FormLabel><FormControl><Textarea placeholder="e.g., By the end of the lesson, students will be able to..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isLessonPlanPending}>
                                        {isLessonPlanPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate</>}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                    <Suspense fallback={<Card><CardContent className="flex items-center justify-center h-full min-h-[300px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>}>
                        <ResultCard title="Generated Lesson Plan" description="Your AI-generated lesson plan will appear here." content={lessonPlan} isPending={isLessonPlanPending} />
                    </Suspense>
                </div>
            </TabsContent>
            <TabsContent value="scheme-of-work">
                <div className="grid gap-6 lg:grid-cols-2">
                     <Card>
                        <CardHeader>
                            <CardTitle>Generate Scheme of Work</CardTitle>
                            <CardDescription>Create a term-long scheme of work.</CardDescription>
                        </CardHeader>
                        <Form {...schemeOfWorkForm}>
                            <form onSubmit={schemeOfWorkForm.handleSubmit(onSchemeOfWorkSubmit)}>
                                <CardContent className="space-y-4">
                                    <FormField control={schemeOfWorkForm.control} name="subject" render={({ field }) => (
                                        <FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl><SelectContent>{subjects.map(s => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={schemeOfWorkForm.control} name="gradeLevel" render={({ field }) => (
                                        <FormItem><FormLabel>Grade Level</FormLabel><FormControl><Input placeholder="e.g., 10th Grade" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={schemeOfWorkForm.control} name="termDuration" render={({ field }) => (
                                        <FormItem><FormLabel>Term Duration</FormLabel><FormControl><Input placeholder="e.g., 12 Weeks" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isSchemePending}>
                                        {isSchemePending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate</>}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                    <Suspense fallback={<Card><CardContent className="flex items-center justify-center h-full min-h-[300px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></CardContent></Card>}>
                        <ResultCard title="Generated Scheme of Work" description="Your AI-generated scheme of work will appear here." content={schemeOfWork} isPending={isSchemePending} />
                    </Suspense>
                </div>
            </TabsContent>
        </Tabs>
    </AppShell>
  );
}
