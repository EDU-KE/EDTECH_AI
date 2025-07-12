
"use client"

import { ClipboardEdit, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface ResultCardProps {
    title: string;
    description: string;
    content: string | null;
    isPending: boolean;
    headerAction?: React.ReactNode;
}

export const ResultCard = React.memo(function ResultCard({ title, description, content, isPending, headerAction }: ResultCardProps) {
    return (
        <Card className="flex flex-col flex-1 min-h-[300px] lg:min-h-0">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {headerAction}
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-26rem)]">
                {isPending && <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {!isPending && !content && (
                    <div className="text-center text-muted-foreground p-4 h-full flex flex-col items-center justify-center">
                        <ClipboardEdit className="mx-auto h-12 w-12" />
                        <p className="mt-2">Use a tool to generate content.</p>
                    </div>
                )}
                {content && (
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap font-body w-full">
                        {content}
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
ResultCard.displayName = 'ResultCard';
