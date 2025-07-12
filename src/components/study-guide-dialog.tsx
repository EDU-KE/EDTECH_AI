
"use client";

import dynamic from 'next/dynamic';
import type { GenerateStudyGuideOutput } from "@/ai/flows/generate-study-guide";
import { BookCheck, BookOpen, ExternalLink, Lightbulb, Loader2, Pointer, Sparkles, Video } from 'lucide-react';
import { Button } from './ui/button';

// Dynamically import AlertDialog components as they are client-side only
const AlertDialog = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialog), { ssr: false });
const AlertDialogContent = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogContent), { ssr: false });
const AlertDialogHeader = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogHeader), { ssr: false });
const AlertDialogTitle = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogTitle), { ssr: false });
const AlertDialogDescription = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogDescription), { ssr: false });
const AlertDialogFooter = dynamic(() => import('@/components/ui/alert-dialog').then(mod => mod.AlertDialogFooter), { ssr: false });

const resourceIcons = {
    "Article": BookOpen,
    "Video": Video,
    "Interactive Tutorial": Pointer,
    "default": Lightbulb,
}

interface StudyGuideDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isPending: boolean;
    guide: GenerateStudyGuideOutput | null;
}

export function StudyGuideDialog({ open, onOpenChange, isPending, guide }: StudyGuideDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" /> AI Study Guide
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Here&apos;s a custom study guide for this book, generated just for you.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    {isPending && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                            <p>Analyzing book and preparing your guide...</p>
                        </div>
                    )}
                    {guide && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">Summary</h3>
                                <p className="text-sm text-muted-foreground">{guide.summary}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                    <BookCheck className="h-5 w-5" /> Key Topics
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    {guide.keyTopics.map((topic, i) => <li key={i}>{topic}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-5 w-5" /> Recommended Resources
                                </h3>
                                <div className="space-y-3">
                                    {guide.recommendedResources.map((rec, i) => {
                                        const Icon = resourceIcons[rec.type as keyof typeof resourceIcons] || resourceIcons.default;
                                        return (
                                            <div key={i} className="flex items-start gap-3">
                                                <Icon className="h-5 w-5 text-primary mt-1 shrink-0" />
                                                <div className="flex-1">
                                                    <a href={rec.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline flex items-center gap-1.5">
                                                        {rec.title} <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                    <p className="text-xs text-muted-foreground">{rec.type}</p>
                                                    <p className="text-sm mt-1">{rec.description}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <AlertDialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
