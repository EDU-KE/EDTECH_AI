
"use client"

import { useState, useTransition, useMemo, useCallback, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DiaryEntry, type DiaryEntryData } from "@/components/diary-entry"
import { Timetable, type TimetableEvent } from "@/components/timetable"
import { useToast } from "@/hooks/use-toast"
import { addDays, setHours, setMinutes } from "date-fns"
import { FolderClock, Loader2, Sparkles } from "lucide-react"
import { getDiaryAdvice } from "@/lib/actions"
import debounce from "lodash/debounce"

const initialEvents: TimetableEvent[] = [
    { id: '1', title: 'Math Study Session', startTime: setMinutes(setHours(new Date(), 10), 0), endTime: setMinutes(setHours(new Date(), 11), 30) },
    { id: '2', title: 'History Reading', startTime: setMinutes(setHours(new Date(), 14), 0), endTime: setMinutes(setHours(new Date(), 15), 0) },
    { id: '3', title: 'Biology Quiz Prep', startTime: setMinutes(setHours(addDays(new Date(), 1), 9), 0), endTime: setMinutes(setHours(addDays(new Date(), 1), 10), 0) },
]

const mockSavedEntry = "### Saved Entry: Study Plan for Finals\n\n*   **Morning:** Review Biology notes, focus on chapters 4-6.\n*   **Afternoon:** Complete 20 practice problems for Algebra.\n*   **Evening:** Draft outline for History essay."

export default function DiaryPage() {
    const [events, setEvents] = useState<TimetableEvent[]>(initialEvents)
    const [isShowingSaved, setIsShowingSaved] = useState(false)
    const { toast } = useToast()
    const [isAiPending, startAiTransition] = useTransition()

    const fetchAIAdvice = useCallback(
        debounce((plan: string) => {
          startAiTransition(async () => {
            const adviceContainer = document.getElementById("ai-advice-container");
            if (!adviceContainer) return;
  
            adviceContainer.innerHTML = `
              <div class="flex items-center justify-center h-full">
                  <div class="flex items-center gap-2 text-muted-foreground">
                      <span class="text-purple-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin h-5 w-5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></span>
                      Analyzing your plan...
                  </div>
              </div>`;
  
            const formData = new FormData();
            formData.append("plan", plan);
            const result = await getDiaryAdvice(formData);
  
            if (result.error) {
              adviceContainer.innerHTML = `<p class="text-destructive-foreground">${result.error}</p>`;
            } else {
               adviceContainer.innerHTML = `<div class="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">${result.advice}</div>`;
            }
          });
        }, 1000),
      [startAiTransition]
    );

    const handleSaveEntry = (data: DiaryEntryData) => {
        setIsShowingSaved(false)
        const newEvent: TimetableEvent = {
            id: (events.length + 1).toString(),
            title: data.activity,
            startTime: data.dateTime,
            endTime: addDays(data.dateTime, 0), // Placeholder end time
        }
        setEvents([...events, newEvent])

        toast({
            title: "Activity Scheduled!",
            description: `"${data.activity}" has been added to your timetable.`,
        })

        setTimeout(() => {
            toast({
                title: "Reminder: Upcoming Activity",
                description: `Your scheduled activity "${data.activity}" is starting soon.`,
            })
        }, 5000)
    }

    const handleViewSaved = () => {
        setIsShowingSaved(true)
        const adviceContainer = document.getElementById("ai-advice-container");
        if (adviceContainer) {
            adviceContainer.innerHTML = `<div class="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">${mockSavedEntry}</div>`
        }
    }

  return (
    <AppShell title="Digital Diary & Planner">
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <DiaryEntry onSave={handleSaveEntry} onViewSaved={handleViewSaved} onPlanChange={fetchAIAdvice} />

                <Card>
                    <CardHeader>
                        <CardTitle>Timetable</CardTitle>
                        <CardDescription>Your weekly schedule at a glance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Timetable events={events} />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card className="sticky top-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            AI Planner Assistant
                        </CardTitle>
                        <CardDescription>Your AI assistant will provide tips and suggestions here as you write your plan.</CardDescription>
                    </CardHeader>
                    <CardContent id="ai-advice-container" className="min-h-[400px]">
                        {isAiPending ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="animate-spin h-5 w-5 text-purple-500" />
                                    Analyzing your plan...
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                <FolderClock className="h-12 w-12 mb-4" />
                                <p>Start typing in the diary to get AI-powered advice, or view your saved entries.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppShell>
  )
}
