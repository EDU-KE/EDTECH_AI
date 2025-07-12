
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getWebSearchResults } from "@/lib/actions";

const formSchema = z.object({
  query: z.string().min(5, "Please enter a query of at least 5 characters."),
});

export default function ResearchPage() {
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchResults(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("query", values.query);
      
      const result = await getWebSearchResults(formData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Search Error",
          description: result.error,
        });
      } else {
        setSearchResults(result.summary ?? "Could not retrieve a summary.");
      }
    });
  }

  return (
    <AppShell title="AI Research Assistant">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Safe Web Search</CardTitle>
            <CardDescription>
              Explore any topic with our AI-powered search assistant. It will find information and provide a safe, concise summary.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Research Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., The impact of climate change on coral reefs"
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
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Research & Summarize</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Research Summary</CardTitle>
            <CardDescription>Your AI-generated summary will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-22rem)]">
            {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {!isPending && !searchResults && (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                    <Search className="mx-auto h-12 w-12" />
                    <p className="mt-2">Enter a topic to start your research.</p>
                </div>
            )}
            {searchResults && (
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                    {searchResults}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
