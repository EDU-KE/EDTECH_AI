
"use client";

import { useRef, useState, useTransition, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Send, User, Sparkles, Lightbulb, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getChatToneAnalysis, getSuggestedResponse } from "@/lib/actions";
import debounce from "lodash/debounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { students } from "@/lib/mock-data";
import Link from "next/link";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


interface Message {
  role: "user" | "peer";
  content: string;
}

interface ToneAnalysis {
    tone: string;
    insight: string;
}

const initialMessages: Message[] = [
    { role: "peer", content: "Hey! How are you feeling about the upcoming physics exam?" },
    { role: "user", content: "A bit stressed, to be honest. I'm struggling with the electromagnetism part." },
];

export default function ChatPage() {
  const [isSending, startSendingTransition] = useTransition();
  const [isAnalyzing, startAnalyzingTransition] = useTransition();
  const [isSuggesting, startSuggestingTransition] = useTransition();
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const analyzeConversation = useCallback(async (currentMessages: Message[]) => {
    startAnalyzingTransition(async () => {
        const formData = new FormData();
        formData.append("messages", JSON.stringify(currentMessages));
        const result = await getChatToneAnalysis(formData);
        if (result.error) {
            console.error("Tone analysis failed:", result.error);
        } else {
            setAnalysis(result.analysis ?? null);
        }
    });
  }, []);

  const debouncedAnalysis = useCallback(debounce(analyzeConversation, 2000), [analyzeConversation]);


  const handleSubmit = (formData: FormData) => {
    const question = formData.get("message") as string;
    if (!question) return;

    startSendingTransition(() => {
        const newMessage: Message = { role: "user", content: question };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setSuggestion(null); // Clear suggestion after sending
        formRef.current?.reset();
        debouncedAnalysis(updatedMessages);
    });
  };

  const handleGetSuggestion = () => {
    startSuggestingTransition(async () => {
        const formData = new FormData();
        formData.append("messages", JSON.stringify(messages));
        formData.append("myRole", "user");
        const result = await getSuggestedResponse(formData);
        if (result.error) {
            toast({ variant: "destructive", title: "Suggestion Error", description: result.error });
        } else {
            setSuggestion(result.suggestion?.suggestion ?? null);
        }
    });
  }

  const handleUseSuggestion = () => {
    if (suggestion && textareaRef.current) {
        textareaRef.current.value = suggestion;
        setSuggestion(null);
    }
  }

  return (
    <AppShell title="Learner Chat">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-10rem)] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Conversation with Alex</CardTitle>
                        <CardDescription>Discuss topics, share ideas, and study together.</CardDescription>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                             <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm">
                                <Users className="size-4" />
                                Contacts
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0" align="end">
                             <Card>
                                <CardHeader className="p-2 border-b">
                                    <Command>
                                        <CommandInput placeholder="Search contacts..." />
                                    </Command>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup heading="Friends">
                                                {students.map(student => (
                                                    <CommandItem key={student.id} onSelect={() => toast({ title: `Chatting with ${student.name}`})} className="flex items-center gap-3 px-2">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.hint} />
                                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="font-medium">{student.name}</div>
                                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                                        </div>
                                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </CardContent>
                            </Card>
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'peer' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://placehold.co/100x100.png" alt="@peer" data-ai-hint="student avatar" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-lg p-3 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm whitespace-pre-wrap font-body">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://placehold.co/100x100.png" alt="@student" data-ai-hint="student avatar" />
                                    <AvatarFallback>S</AvatarFallback>
                                </Avatar>
                            )}
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="pt-4 border-t flex flex-col items-start gap-2">
                    {suggestion && (
                        <div className="w-full">
                            <Card className="bg-muted p-2">
                                <p className="text-xs text-muted-foreground">AI Suggestion:</p>
                                <p className="text-sm italic">"{suggestion}"</p>
                                <Button size="sm" variant="link" className="p-0 h-auto" onClick={handleUseSuggestion}>Use this suggestion</Button>
                            </Card>
                        </div>
                    )}
                    <div className="flex w-full items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleGetSuggestion} disabled={isSuggesting} className="shrink-0">
                            {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                        </Button>
                        <form ref={formRef} action={handleSubmit} className="flex-1 flex w-full items-center gap-2">
                            <Textarea
                                ref={textareaRef}
                                name="message"
                                placeholder="Type your message here..."
                                className="flex-1 resize-none"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        formRef.current?.requestSubmit();
                                    }
                                }}
                                disabled={isSending}
                            />
                            <Button type="submit" disabled={isSending} size="icon" className="shrink-0">
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Tone Analysis
                    </CardTitle>
                    <CardDescription>The AI will analyze the conversation's tone here.</CardDescription>
                </CardHeader>
                <CardContent id="ai-tone-container" className="min-h-[200px] flex items-center justify-center">
                   {isAnalyzing && (
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing tone...
                    </div>
                   )}
                   {!isAnalyzing && !analysis && (
                     <div className="text-center text-muted-foreground">
                        <Bot className="h-10 w-10 mx-auto mb-2" />
                        <p>The conversation analysis will appear here as you chat.</p>
                    </div>
                   )}
                   {!isAnalyzing && analysis && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-sm">Overall Tone</h3>
                                <p className="text-lg font-bold text-primary">{analysis.tone}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">AI Insight</h3>
                                <p className="text-sm text-muted-foreground">{analysis.insight}</p>
                            </div>
                        </div>
                   )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
