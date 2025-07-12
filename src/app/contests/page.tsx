"use client"

import { useEffect, useState, useTransition } from "react"
import { Bot, Loader2 } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { ContestCard } from "@/components/contest-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { contestsData, studentPerformance } from "@/lib/mock-data"
import { getContestRecommendation } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import type { RecommendContestOutput } from "@/ai/flows/recommend-contest"

export default function ContestsPage() {
    const [recommendation, setRecommendation] = useState<RecommendContestOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("studentProfile", JSON.stringify(studentPerformance));
            
            // Map contestsData to include a subject hint for better matching
            const contestsWithSubjects = contestsData.map(c => {
                let subject = "General";
                if (c.title.toLowerCase().includes("math")) subject = "Mathematics";
                if (c.title.toLowerCase().includes("science")) subject = "Science";
                if (c.title.toLowerCase().includes("history")) subject = "History";
                return { ...c, subject };
            });

            formData.append("contests", JSON.stringify(contestsWithSubjects));
            const result = await getContestRecommendation(formData);

            if (result.error) {
                toast({ variant: "destructive", title: "AI Recommendation Error", description: result.error });
            } else {
                setRecommendation(result.recommendation ?? null);
            }
        });
    }, [toast]);

    const recommendedContest = recommendation ? contestsData.find(c => c.id === recommendation.recommendedContestId) : null;
    const otherContests = contestsData.filter(c => !recommendation || c.id !== recommendation.recommendedContestId);

  return (
    <AppShell title="Contests & Quizzes">
        <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Recommendation</CardTitle>
                    <CardDescription>Based on your profile, here is our top suggestion for you.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[150px] flex items-center justify-center">
                     {isPending && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Finding the best contest for you...</div>}
                     {!isPending && recommendedContest && recommendation && (
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                            <div className="md:w-1/3 lg:w-1/4">
                                <ContestCard contest={recommendedContest} />
                            </div>
                            <div className="md:w-2/3 lg:w-3/4">
                                 <div className="prose prose-sm max-w-none dark:prose-invert font-body">
                                    {recommendation.reasoning}
                                </div>
                            </div>
                        </div>
                     )}
                     {!isPending && !recommendation && (
                        <p className="text-sm text-muted-foreground">Could not generate a recommendation at this time.</p>
                     )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Upcoming Competitions</CardTitle>
                    <CardDescription>Test your skills, compete with peers, and win prizes!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {otherContests.map((contest) => (
                            <ContestCard key={contest.id} contest={contest} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppShell>
  )
}
