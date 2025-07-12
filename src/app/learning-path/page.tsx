
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, FolderClock } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getLearningPath } from "@/lib/actions";
import { subjects } from "@/lib/mock-data";

const formSchema = z.object({
  subject: z.string({ required_error: "Please select a subject." }),
  knowledgeLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "You need to select a knowledge level.",
  }),
  learningGoals: z.string().min(10, "Please describe your learning goals in at least 10 characters."),
});

const mockSavedPath = "### Saved Math Path for Beginners\n\n**Goal:** Understand Algebra Basics\n\n*   **Week 1: Introduction to Variables**\n    *   Resource: Khan Academy - Intro to variables\n*   **Week 2: Solving Simple Equations**\n    *   Resource: YouTube - PatrickJMT Solving Equations\n*   **Week 3: Inequalities**\n    *   Resource: Interactive practice on IXL";


export default function LearningPathPage() {
  const [isPending, startTransition] = useTransition();
  const [learningPath, setLearningPath] = useState<string | null>(null);
  const [isShowingSaved, setIsShowingSaved] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        knowledgeLevel: "Beginner",
        learningGoals: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLearningPath(null);
    setIsShowingSaved(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("subject", values.subject);
      formData.append("knowledgeLevel", values.knowledgeLevel);
      formData.append("learningGoals", values.learningGoals);
      
      const result = await getLearningPath(formData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        setLearningPath(result.learningPath ?? null);
      }
    });
  }

  function handleViewSaved() {
    setIsShowingSaved(true);
    setLearningPath(null);
  }

  return (
    <AppShell title="AI Personalized Learning Path">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Path</CardTitle>
            <CardDescription>Tell us about your goals, and we&apos;ll generate a custom learning plan for you.</CardDescription>
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
                  name="knowledgeLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Current Knowledge Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Beginner" />
                            </FormControl>
                            <FormLabel className="font-normal">Beginner</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Intermediate" />
                            </FormControl>
                            <FormLabel className="font-normal">Intermediate</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Advanced" />
                            </FormControl>
                            <FormLabel className="font-normal">Advanced</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="learningGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I want to prepare for my final exams and understand key concepts."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Path</>
                  )}
                </Button>
                 <Button type="button" variant="outline" onClick={handleViewSaved}>
                    <FolderClock className="mr-2 h-4 w-4" /> View Saved Path
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Your Personalized Plan</CardTitle>
            <CardDescription>Your AI-generated learning path will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-22rem)]">
            {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {!isPending && !learningPath && !isShowingSaved && (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                    <Sparkles className="mx-auto h-12 w-12" />
                    <p className="mt-2">Fill out the form to see your path.</p>
                </div>
            )}
            {learningPath && (
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                    {learningPath}
                </div>
            )}
            {isShowingSaved && (
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                    {mockSavedPath}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
