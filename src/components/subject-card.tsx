import Link from "next/link"
import React from "react"
import type { LucideIcon } from "lucide-react"
import { Sparkles, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button";
import type { Subject } from "@/lib/mock-data";

interface SubjectCardProps {
  subject: Subject;
  onAnalyze: (subject: Subject) => void;
}

export const SubjectCard = React.memo(function SubjectCard({ subject, onAnalyze }: SubjectCardProps) {
  const { id, title, description, Icon, tag } = subject;
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader>
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Icon className="h-10 w-10 text-primary" />
            </div>
            <div className="flex items-center gap-3">
            <CardTitle className="font-headline">{title}</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit mt-1">{tag}</Badge>
        </CardHeader>
        <CardContent className="flex-grow">
            <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/subjects/${id}`}>
                    Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            <Button onClick={(e) => { e.stopPropagation(); onAnalyze(subject); }} variant="default" size="sm">
                AI Analyze <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
  )
});
SubjectCard.displayName = 'SubjectCard';
