'use client';

import { useEffect, useState, useTransition } from 'react';
import { Bot, Loader2, Star } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { onlineTutors, subjects } from '@/lib/mock-data';
import { TutorCard } from '@/components/tutor-card';
import { getTutorRecommendation } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { RecommendTutorOutput } from '@/ai/flows/recommend-tutor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OnlineTutorsPage() {
  const [recommendation, setRecommendation] = useState<RecommendTutorOutput | null>(null);
  const [subject, setSubject] = useState(subjects[0].title);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
        setRecommendation(null);
        const formData = new FormData();
        formData.append("subject", subject);
        const result = await getTutorRecommendation(formData);

        if (result.error) {
            toast({ variant: 'destructive', title: 'AI Recommendation Error', description: result.error });
        } else {
            setRecommendation(result.data ?? null);
        }
    });
  }, [subject, toast]);

  return (
    <AppShell title="Online Tutors">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Bot className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="flex items-center gap-2">
                        AI Tutor Recommendation
                        </CardTitle>
                        <CardDescription>
                            Select a subject and let our AI find the perfect tutor for you.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <div className="w-[200px] shrink-0">
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((s) => (
                                    <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-h-[100px] flex items-center">
                        {isPending && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5" />Searching for the best tutor...</div>}
                        {!isPending && recommendation && (
                            <div className="flex items-center gap-4 w-full">
                                <TutorCard tutor={recommendation.tutor} compact />
                                <div className="prose prose-sm max-w-none dark:prose-invert font-body">
                                    {recommendation.recommendation}
                                </div>
                            </div>
                        )}
                         {!isPending && !recommendation && (
                            <p className="text-sm text-muted-foreground">Could not find a recommendation for this subject.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Available Tutors</CardTitle>
            <CardDescription>Browse our roster of expert tutors.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {onlineTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
