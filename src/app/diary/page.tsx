
"use client"

import { useState, useTransition, useMemo, useCallback, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DiaryEntry, type DiaryEntryData } from "@/components/diary-entry"
import { Timetable, type TimetableEvent } from "@/components/timetable"
import { DiaryStats } from "@/components/diary-stats"
import { StudyTips } from "@/components/study-tips"
import { useToast } from "@/hooks/use-toast"
import { addDays, setHours, setMinutes } from "date-fns"
import { FolderClock, Loader2, Sparkles, BookOpen, Calendar, Clock, Target } from "lucide-react"
import { getDiaryAdvice } from "@/lib/actions"
import debounce from "lodash/debounce"
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme"
import { Badge } from "@/components/ui/badge"
import { componentCache } from "@/lib/cache/cache-utility"

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
    const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme()

    // Memoized cache key for diary data
    const diaryDataKey = useMemo(() => 
        `diary_data_${curriculum || 'default'}`, 
        [curriculum]
    )

    // Cached AI advice fetch
    const fetchAIAdvice = useCallback(
        debounce((plan: string) => {
          const cacheKey = `ai_advice_${plan.substring(0, 100)}`;
          
          // Check cache first
          const cachedAdvice = componentCache.get(cacheKey);
          if (cachedAdvice) {
            const adviceContainer = document.getElementById("ai-advice-container");
            if (adviceContainer) {
              adviceContainer.innerHTML = cachedAdvice;
            }
            return;
          }

          startAiTransition(async () => {
            const adviceContainer = document.getElementById("ai-advice-container");
            if (!adviceContainer) return;
  
            const spinnerColor = theme?.accent || 'text-purple-500';
            adviceContainer.innerHTML = `
              <div class="flex items-center justify-center h-full">
                  <div class="flex items-center gap-2 text-muted-foreground">
                      <span class="${spinnerColor}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin h-5 w-5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></span>
                      Analyzing your plan...
                  </div>
              </div>`;
  
            const formData = new FormData();
            formData.append("plan", plan);
            const result = await getDiaryAdvice(formData);
  
            if (result.error) {
              const errorContent = `<p class="text-destructive-foreground">${result.error}</p>`;
              adviceContainer.innerHTML = errorContent;
            } else {
               const adviceContent = `<div class="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">${result.advice}</div>`;
               adviceContainer.innerHTML = adviceContent;
               // Cache the successful response
               componentCache.set(cacheKey, adviceContent, 10 * 60 * 1000); // Cache for 10 minutes
            }
          });
        }, 1000),
      [startAiTransition, theme]
    );

    // Optimized event handling with caching
    const handleSaveEntry = useCallback((data: DiaryEntryData) => {
        setIsShowingSaved(false)
        const newEvent: TimetableEvent = {
            id: (events.length + 1).toString(),
            title: data.activity,
            startTime: data.dateTime,
            endTime: addDays(data.dateTime, 0), // Placeholder end time
        }
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);

        // Cache the updated events
        componentCache.set(`${diaryDataKey}_events`, updatedEvents, 5 * 60 * 1000);

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
    }, [events, diaryDataKey, toast]);

    const handleViewSaved = useCallback(() => {
        setIsShowingSaved(true)
        const adviceContainer = document.getElementById("ai-advice-container");
        if (adviceContainer) {
            adviceContainer.innerHTML = `<div class="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">${mockSavedEntry}</div>`
        }
    }, []);

  return (
    <AppShell title="Digital Diary & Planner">
        {/* Header Section with Curriculum Theme */}
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${theme?.secondary || 'bg-gray-100'} border ${theme?.border || 'border-gray-200'}`}>
                        <BookOpen className={`h-6 w-6 ${theme?.accent || 'text-gray-600'}`} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${theme?.accent || 'text-gray-900'}`}>
                            Digital Diary & Planner
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {curriculumInfo ? `${curriculumInfo.name} Learning Journal` : 'Your personalized learning journal'}
                        </p>
                    </div>
                </div>
                {curriculum && (
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${theme?.badge || 'bg-gray-100'}`}>
                            <div className="text-lg mr-1">{curriculumInfo?.icon}</div>
                            {curriculum}
                        </Badge>
                    </div>
                )}
            </div>
        </div>

        {/* Diary Statistics */}
        <DiaryStats 
          totalEntries={12}
          completedTasks={8}
          totalTasks={10}
          weeklyStreak={5}
          studyTime={24}
        />

        {/* Study Tips */}
        <StudyTips />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <DiaryEntry onSave={handleSaveEntry} onViewSaved={handleViewSaved} onPlanChange={fetchAIAdvice} />

                {/* Enhanced Timetable Card */}
                <Card className={`border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
                    <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                        <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
                            <Calendar className={`h-5 w-5 ${theme?.accent || 'text-gray-600'}`} />
                            Weekly Schedule
                        </CardTitle>
                        <CardDescription>
                            Your personalized timetable with {events.length} scheduled activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Timetable events={events} />
                    </CardContent>
                </Card>
            </div>
            
            {/* Enhanced AI Assistant Card */}
            <div className="lg:col-span-1">
                 <Card className={`sticky top-4 border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
                    <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
                        <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
                            <Sparkles className={`h-5 w-5 ${theme?.accent || 'text-purple-500'}`} />
                            AI Planner Assistant
                            <Badge variant="secondary" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
                                Smart
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Your AI assistant provides personalized tips and suggestions as you plan your studies
                        </CardDescription>
                    </CardHeader>
                    <CardContent id="ai-advice-container" className="min-h-[400px] p-4">
                        {isAiPending ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className={`animate-spin h-5 w-5 ${theme?.accent || 'text-purple-500'}`} />
                                    Analyzing your plan...
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                <div className={`p-4 rounded-full ${theme?.secondary || 'bg-gray-100'} mb-4`}>
                                    <Target className={`h-8 w-8 ${theme?.accent || 'text-gray-600'}`} />
                                </div>
                                <p className="text-base font-medium mb-2">Ready to help you plan!</p>
                                <p className="text-sm">
                                    Start typing in the diary to get AI-powered advice, or view your saved entries.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppShell>
  )
}
