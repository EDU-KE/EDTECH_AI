
"use client"

import { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DashboardCard } from "@/components/dashboard-card";
import { SubjectCard } from "@/components/subject-card";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardCards, subjects, type Subject } from "@/lib/mock-data";
import { BookPlus, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { getSubjectAnalysis } from "@/lib/actions";
import { getSubjectAnalysisFallback } from "@/lib/actions-fallback";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getUserProfile, needsCurriculumSelection, type UserProfile } from "@/lib/auth";
import { useCurriculum } from "@/components/CurriculumContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const { user } = useAuth();
  const { showModal } = useCurriculum();
  const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalysisPending, startAnalysisTransition] = useTransition();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showCurriculumReminder, setShowCurriculumReminder] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedSubjectIds = localStorage.getItem("enrolledSubjects");
    if (storedSubjectIds) {
      const subjectIds: string[] = JSON.parse(storedSubjectIds);
      const userSubjects = subjects.filter(subject => subjectIds.includes(subject.id));
      setEnrolledSubjects(userSubjects);
    }

    // Check if user needs curriculum selection
    const checkCurriculumStatus = async () => {
      if (!user?.uid) return;
      
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        
        if (needsCurriculumSelection(profile)) {
          setShowCurriculumReminder(true);
        }
      } catch (error) {
        console.error('Error checking curriculum status:', error);
      }
    };

    if (user) {
      checkCurriculumStatus();
    }
  }, [user]);

  const handleAnalyzeSubject = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    setAnalysis(null);
    startAnalysisTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("subjectTitle", subject.title);
          
          // Try main AI action first
          let result = await getSubjectAnalysis(formData);
          
          // If main action fails, use fallback
          if (!result) {
            console.log('Main AI action failed, using fallback...');
            result = await getSubjectAnalysisFallback(formData);
          }
          
          if (result.error) {
              toast({ variant: "destructive", title: "AI Analysis Error", description: result.error });
              setSelectedSubject(null);
          } else {
              setAnalysis(result.analysis ?? "Could not load analysis.");
          }
        } catch (error) {
          console.error('Analysis error:', error);
          
          // Fallback when everything fails
          try {
            const formData = new FormData();
            formData.append("subjectTitle", subject.title);
            const fallbackResult = await getSubjectAnalysisFallback(formData);
            
            if (fallbackResult.error) {
              toast({ 
                variant: "destructive", 
                title: "AI Analysis Error", 
                description: fallbackResult.error 
              });
              setSelectedSubject(null);
            } else {
              setAnalysis(fallbackResult.analysis ?? "Could not load analysis.");
              toast({ 
                title: "Analysis Ready", 
                description: "Using offline analysis mode." 
              });
            }
          } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            toast({ 
              variant: "destructive", 
              title: "AI Analysis Error", 
              description: "Unable to generate analysis. Please try again later." 
            });
            setSelectedSubject(null);
          }
        }
    });
  }, [toast]);

  return (
    <AppShell title="Dashboard">
        {showCurriculumReminder && (
            <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <div className="flex items-center justify-between">
                        <span>Complete your curriculum selection to get personalized learning content.</span>
                        <div className="flex gap-2 ml-4">
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setShowCurriculumReminder(false)}
                                className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900"
                            >
                                Remind Later
                            </Button>
                            <Button 
                                size="sm"
                                onClick={() => {
                                    setShowCurriculumReminder(false);
                                    showModal();
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                Complete Setup
                            </Button>
                        </div>
                    </div>
                </AlertDescription>
            </Alert>
        )}
        
        <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardCards.map((card) => (
                    <DashboardCard 
                        key={card.id}
                        title={card.title}
                        description={card.description}
                        Icon={card.Icon}
                        href={card.href}
                    />
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Subjects</CardTitle>
                    <CardDescription>
                        Continue your learning journey in your enrolled subjects.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {enrolledSubjects.length > 0 ? (
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {enrolledSubjects.map((subject) => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    onAnalyze={handleAnalyzeSubject}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="mb-4 text-muted-foreground">You haven't enrolled in any subjects yet.</p>
                            <Button asChild>
                                <Link href="/enroll">
                                    <BookPlus className="mr-2 h-4 w-4" />
                                    Enroll in Subjects
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <AlertDialog open={!!selectedSubject} onOpenChange={(open) => !open && setSelectedSubject(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><Sparkles className="text-primary h-5 w-5" /> AI Analysis: {selectedSubject?.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Here's a quick overview of what this subject is all about.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4 min-h-[200px] flex items-center justify-center">
                    {isAnalysisPending && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                    {!isAnalysisPending && analysis && (
                        <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                            {analysis}
                        </div>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedSubject(null)}>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </AppShell>
  );
}
