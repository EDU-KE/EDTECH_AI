
"use client"

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SubjectCard } from "@/components/subject-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subjects, type Subject } from "@/lib/mock-data";
import { BookPlus, Loader2, Sparkles } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { getSubjectAnalysis } from "@/lib/actions";
import { getSubjectAnalysisFallback } from "@/lib/actions-fallback";
import { useToast } from "@/hooks/use-toast";

export default function MySubjectsPage() {
    const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalysisPending, startAnalysisTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        const storedSubjectIds = localStorage.getItem("enrolledSubjects");
        if (storedSubjectIds) {
            const subjectIds: string[] = JSON.parse(storedSubjectIds);
            const userSubjects = subjects.filter(subject => subjectIds.includes(subject.id));
            setEnrolledSubjects(userSubjects);
        }
    }, []);

    const handleAnalyzeSubject = (subject: Subject) => {
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
    }

    return (
        <AppShell title="My Subjects">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Currently Enrolled Subjects</CardTitle>
                        <CardDescription>
                            Click on a subject to view its details or enroll in more subjects.
                        </CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/enroll">
                            <BookPlus className="mr-2 h-4 w-4" />
                            Enroll in New Subjects
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {enrolledSubjects.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {enrolledSubjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onAnalyze={() => handleAnalyzeSubject(subject)}
                            />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="mb-4 text-muted-foreground">You are not enrolled in any subjects yet.</p>
                            <Button asChild>
                                <Link href="/enroll">
                                    <BookPlus className="mr-2 h-4 w-4" />
                                    Enroll Now
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

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
