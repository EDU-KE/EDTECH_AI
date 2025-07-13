
"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search, Sparkles, BookOpen, X, Save } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getWebSearchResults } from "@/lib/actions";

const formSchema = z.object({
  query: z.string().min(5, "Please enter a query of at least 5 characters."),
});

// Type for saved search results
interface SavedSearch {
  id: string;
  query: string;
  summary: string;
  topic: string;
  timestamp: Date;
}

// Function to categorize search queries into topics
function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('science') || lowerQuery.includes('physics') || lowerQuery.includes('chemistry') || lowerQuery.includes('biology') || lowerQuery.includes('experiment')) {
    return 'Science';
  } else if (lowerQuery.includes('math') || lowerQuery.includes('algebra') || lowerQuery.includes('geometry') || lowerQuery.includes('calculus') || lowerQuery.includes('equation')) {
    return 'Mathematics';
  } else if (lowerQuery.includes('history') || lowerQuery.includes('historical') || lowerQuery.includes('ancient') || lowerQuery.includes('war') || lowerQuery.includes('civilization')) {
    return 'History';
  } else if (lowerQuery.includes('literature') || lowerQuery.includes('english') || lowerQuery.includes('writing') || lowerQuery.includes('poem') || lowerQuery.includes('author')) {
    return 'Literature';
  } else if (lowerQuery.includes('geography') || lowerQuery.includes('climate') || lowerQuery.includes('environment') || lowerQuery.includes('earth') || lowerQuery.includes('ocean')) {
    return 'Geography';
  } else if (lowerQuery.includes('technology') || lowerQuery.includes('computer') || lowerQuery.includes('programming') || lowerQuery.includes('internet') || lowerQuery.includes('digital')) {
    return 'Technology';
  } else if (lowerQuery.includes('art') || lowerQuery.includes('music') || lowerQuery.includes('painting') || lowerQuery.includes('culture') || lowerQuery.includes('artist')) {
    return 'Arts & Culture';
  } else if (lowerQuery.includes('health') || lowerQuery.includes('medicine') || lowerQuery.includes('disease') || lowerQuery.includes('medical') || lowerQuery.includes('nutrition')) {
    return 'Health & Medicine';
  } else {
    return 'General';
  }
}

export default function ResearchPage() {
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      try {
        const parsedSearches = JSON.parse(saved).map((search: any) => ({
          ...search,
          timestamp: new Date(search.timestamp)
        }));
        setSavedSearches(parsedSearches);
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  }, []);

  // Save searches to localStorage whenever savedSearches changes
  useEffect(() => {
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  // Function to save current search
  const saveCurrentSearch = () => {
    if (searchResults && currentQuery) {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        query: currentQuery,
        summary: searchResults,
        topic: categorizeQuery(currentQuery),
        timestamp: new Date()
      };
      
      setSavedSearches(prev => [newSearch, ...prev]);
      toast({
        title: "Search Saved",
        description: `"${currentQuery}" has been saved to ${newSearch.topic}`,
      });
    }
  };

  // Function to delete a saved search
  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
    toast({
      title: "Search Deleted",
      description: "The saved search has been removed.",
    });
  };

  // Group saved searches by topic
  const groupedSearches = savedSearches.reduce((acc, search) => {
    if (!acc[search.topic]) {
      acc[search.topic] = [];
    }
    acc[search.topic].push(search);
    return acc;
  }, {} as Record<string, SavedSearch[]>);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchResults(null);
    setCurrentQuery(values.query);
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
            <CardTitle className="flex items-center justify-between">
              Safe Web Search
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Saved Searches ({savedSearches.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Saved Research Topics</DialogTitle>
                    <DialogDescription>
                      Browse your saved searches organized by topic
                    </DialogDescription>
                  </DialogHeader>
                  
                  {Object.keys(groupedSearches).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No saved searches yet. Start researching to save your findings!</p>
                    </div>
                  ) : (
                    <Tabs defaultValue={Object.keys(groupedSearches)[0]} className="w-full">
                      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(groupedSearches).length}, 1fr)` }}>
                        {Object.keys(groupedSearches).map((topic) => (
                          <TabsTrigger key={topic} value={topic} className="text-xs">
                            {topic} ({groupedSearches[topic].length})
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {Object.entries(groupedSearches).map(([topic, searches]) => (
                        <TabsContent key={topic} value={topic} className="mt-4">
                          <ScrollArea className="h-[50vh]">
                            <div className="space-y-4">
                              {searches.map((search) => (
                                <Card key={search.id} className="relative">
                                  <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <CardTitle className="text-sm font-medium">
                                          {search.query}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="secondary" className="text-xs">
                                            {search.topic}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">
                                            {search.timestamp.toLocaleDateString()} at {search.timestamp.toLocaleTimeString()}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSavedSearch(search.id)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <div className="prose prose-sm max-w-none dark:prose-invert text-sm whitespace-pre-wrap">
                                      {search.summary.length > 300 
                                        ? search.summary.substring(0, 300) + "..." 
                                        : search.summary
                                      }
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}
                </DialogContent>
              </Dialog>
            </CardTitle>
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
            <CardTitle className="flex items-center justify-between">
              AI Research Summary
              {searchResults && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={saveCurrentSearch}
                  className="ml-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </CardTitle>
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
