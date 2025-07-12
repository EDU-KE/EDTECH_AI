
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lightbulb, Loader2, BookOpen, Video, Pointer } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getRecommendations } from "@/lib/actions";
import { subjects } from "@/lib/mock-data";
import type { GenerateRecommendationsOutput } from "@/ai/flows/generate-recommendations";
import Link from "next/link";

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

export default function RecommendationsPage() {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<GenerateRecommendationsOutput['recommendations'] | null>(null);
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

  return (
    <AppShell title="AI Resource Recommendations">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Find Learning Resources</CardTitle>
            <CardDescription>Tell us what you want to learn, and we'll find resources for you.</CardDescription>
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
                    <p className="mt-2">Fill out the form to see recommendations.</p>
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
    </AppShell>
  );
}
