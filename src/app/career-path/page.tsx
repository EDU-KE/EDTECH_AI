
"use client"

import { useState, useTransition } from "react"
import { Loader2, Sparkles, Route, Briefcase, School } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getCareerPath } from "@/lib/actions"
import { studentPerformance } from "@/lib/mock-data"
import type { RecommendCareerPathOutput } from "@/ai/flows/recommend-career-path"

export default function CareerPathPage() {
    const [path, setPath] = useState<RecommendCareerPathOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGeneratePath = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("performanceData", JSON.stringify(studentPerformance));
            const result = await getCareerPath(formData);

            if (result.error) {
                toast({ variant: "destructive", title: "AI Analysis Error", description: result.error });
            } else {
                setPath(result.path ?? null);
            }
        });
    }

  return (
    <AppShell title="AI Career Path Advisor">
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Your Future Career Path</CardTitle>
                        <CardDescription>Based on your performance and interests, here are some potential career paths and the subjects you should focus on.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center overflow-auto">
                        <div className="h-full w-full">
                            {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                            {!isPending && !path && (
                                <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                    <Route className="mx-auto h-12 w-12" />
                                    <p className="mt-2">Click the button to generate your personalized career advice.</p>
                                </div>
                            )}
                            {path && (
                                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-20rem)] p-1">
                                    <div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Briefcase className="h-5 w-5 text-primary" /> Recommended Career Paths</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {path.recommendedPaths.map((p, i) => (
                                                <Card key={i} className="bg-muted/50">
                                                    <CardHeader className="p-4">
                                                        <CardTitle className="text-base">{p.career}</CardTitle>
                                                        <CardDescription className="text-xs">{p.field}</CardDescription>
                                                        <p className="text-sm pt-2">{p.reasoning}</p>
                                                    </CardHeader>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><School className="h-5 w-5 text-primary" /> Subject Focus Recommendations</h3>
                                        <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                                            {path.subjectRecommendations}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Your Path</CardTitle>
                        <CardDescription>Let AI analyze your academic profile to suggest suitable careers and study plans.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground mb-4">The AI will analyze your strongest and weakest subjects, recent scores, and stated interests to provide guidance.</p>
                        <Button onClick={handleGeneratePath} disabled={isPending} className="w-full">
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Career Advice</>}
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Your Academic Snapshot</CardTitle>
                        <CardDescription>This data is used to generate your recommendations.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                       <div>
                            <h4 className="font-semibold">Strongest Subjects</h4>
                            <p className="text-muted-foreground">{studentPerformance.strongestSubjects.join(', ')}</p>
                       </div>
                       <div>
                            <h4 className="font-semibold">Subjects to Improve</h4>
                            <p className="text-muted-foreground">{studentPerformance.weakestSubjects.join(', ')}</p>
                       </div>
                       <div>
                            <h4 className="font-semibold">Interests</h4>
                            <p className="text-muted-foreground">{studentPerformance.interests.join(', ')}</p>
                       </div>
                       <div>
                            <h4 className="font-semibold">Recent Scores</h4>
                            <ul className="text-muted-foreground list-disc pl-5">
                                {Object.entries(studentPerformance.recentScores).map(([subject, score]) => (
                                    <li key={subject}><span className="capitalize">{subject}</span>: {score}%</li>
                                ))}
                            </ul>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppShell>
  );
}
