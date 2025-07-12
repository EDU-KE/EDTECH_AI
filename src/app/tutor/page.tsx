
"use client";

import { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2, Send, User } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getTutorResponse } from "@/lib/actions";
import { subjects } from "@/lib/mock-data";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function TutorPage() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState(subjects[0].title);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    const question = formData.get("question") as string;
    if (!question) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    formRef.current?.reset();

    startTransition(async () => {
      const fd = new FormData();
      fd.append("subject", subject);
      fd.append("question", question);
      const result = await getTutorResponse(fd);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "AI Tutor Error",
          description: result.error,
        });
        // Add an error message to the chat
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: `Sorry, I encountered an error. ${result.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: result.answer ?? "Sorry, I couldn't get a response." },
        ]);
      }
    });
  };

  return (
    <AppShell title="AI Tutor">
      <Card className="h-[calc(100vh-10rem)] flex flex-col">
        <CardHeader>
          <CardTitle>Chat with your AI Tutor</CardTitle>
          <CardDescription>Select a subject and ask any question.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <Bot className="mx-auto h-12 w-12" />
                            <p className="mt-2">Ask a question to get started.</p>
                        </div>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'bot' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={16} /></AvatarFallback>
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
                {isPending && (
                    <div className="flex items-start gap-4">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={16} /></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-muted">
                           <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <form ref={formRef} action={handleSubmit} className="flex flex-col md:flex-row w-full items-start gap-2 md:gap-4">
            <Select name="subject" defaultValue={subject} onValueChange={setSubject} required>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.title}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex w-full items-center gap-2">
                <Textarea
                name="question"
                placeholder="Type your question here..."
                className="flex-1 resize-none"
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        formRef.current?.requestSubmit();
                    }
                }}
                disabled={isPending}
                />
                <Button type="submit" disabled={isPending} size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
                </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </AppShell>
  );
}
