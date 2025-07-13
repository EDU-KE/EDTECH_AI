
"use client"

import { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DashboardCard } from "@/components/dashboard-card";
import { SubjectCard } from "@/components/subject-card";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardCards, subjects, type Subject } from "@/lib/mock-data";
import { BookOpenCheck, BookPlus, Loader2, Sparkles } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { getSubjectAnalysis } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalysisPending, startAnalysisTransition] = useTransition();
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedSubjectIds = localStorage.getItem("enrolledSubjects");
    if (storedSubjectIds) {
      const subjectIds: string[] = JSON.parse(storedSubjectIds);
      const userSubjects = subjects.filter(subject => subjectIds.includes(subject.id));
      setEnrolledSubjects(userSubjects);
    }
    
    // Show welcome card on first visit to dashboard
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
        setShowWelcomeCard(true);
        sessionStorage.setItem("hasSeenWelcome", "true");

        const timer = setTimeout(() => {
            setShowWelcomeCard(false);
        }, 3000); // Auto-close after 3 seconds

        return () => clearTimeout(timer);
    }

  }, []);

  const handleAnalyzeSubject = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    setAnalysis(null);
    startAnalysisTransition(async () => {
        const formData = new FormData();
        formData.append("subjectTitle", subject.title);
        const result = await getSubjectAnalysis(formData);
        if (result.error) {
            toast({ variant: "destructive", title: "AI Analysis Error", description: result.error });
            setSelectedSubject(null);
        } else {
            setAnalysis(result.analysis ?? "Could not load analysis.");
        }
    });
  }, [toast]);

  return (
    <AppShell title="Dashboard">
        {showWelcomeCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in-0">
                <Card className="w-full max-w-md m-4 shadow-2xl rounded-2xl animate-in fade-in-0 zoom-in-95">
                    <CardHeader className="text-center p-8">
                        <div className="flex justify-center items-center mb-4">
                            <BookOpenCheck className="h-14 w-14 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Welcome to the EdTech AI Hub!</CardTitle>
                        <CardDescription className="pt-2">
                            This is an AI-powered platform to enhance your learning experience.
                            <br />
                            <span className="text-xs text-muted-foreground mt-2 block">Developed by Kariuki James Kariuki</span>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
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
