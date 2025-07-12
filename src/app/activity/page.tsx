"use client"

import { useEffect, useState, useTransition } from "react"
import { Activity, Bot, Loader2, BookCheck } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { studentActivities } from "@/lib/mock-data"
import { getActivityAnalysis } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export default function ActivityPage() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("activities", JSON.stringify(studentActivities));
            const result = await getActivityAnalysis(formData);

            if (result.error) {
                toast({ variant: "destructive", title: "AI Analysis Error", description: result.error });
            } else {
                setAnalysis(result.analysis ?? "Could not load AI analysis.");
            }
        });
    }, [toast]);

  return (
    <AppShell title="Activity Tracker">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of your recent work and AI-powered analysis of your learning habits.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={["activity-log", "ai-analysis"]} className="w-full space-y-4">
                    <AccordionItem value="activity-log" className="border rounded-lg">
                        <AccordionTrigger className="text-lg font-semibold p-4 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <BookCheck className="h-5 w-5" />
                                <span>Record of Work</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                           <div className="space-y-4">
                                {studentActivities.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <Activity className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p>{activity.description || activity.asked}</p>
                                            <p className="text-sm text-muted-foreground">{activity.timestamp} - {activity.subject}</p>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="ai-analysis" className="border rounded-lg">
                        <AccordionTrigger className="text-lg font-semibold p-4 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Bot className="h-5 w-5" />
                                <span>AI Learning Analysis</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            {isPending && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Analyzing your activity...</div>}
                            {!isPending && analysis && (
                                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                                    {analysis}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </AppShell>
  );
}
