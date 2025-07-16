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
import { useCurriculumTheme, getThemeOrDefault } from "@/hooks/use-curriculum-theme";

interface SubjectCardProps {
  subject: Subject;
  onAnalyze: (subject: Subject) => void;
}

export const SubjectCard = React.memo(function SubjectCard({ subject, onAnalyze }: SubjectCardProps) {
  const { id, title, description, Icon, tag } = subject;
  const { theme, curriculumInfo } = useCurriculumTheme();
  const currentTheme = getThemeOrDefault(theme);

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 h-full flex flex-col ${currentTheme.hover} border-2 ${currentTheme.border}`}>
        <CardHeader className="pb-4">
            <div className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full ${currentTheme.secondary} mb-3 sm:mb-4 border ${currentTheme.border}`}>
            <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${currentTheme.accent}`} />
            </div>
            <div className="flex items-center gap-3">
            <CardTitle className={`font-headline text-base sm:text-lg leading-tight ${currentTheme.accent}`}>{title}</CardTitle>
            </div>
            <Badge variant="secondary" className={`w-fit mt-1 text-xs ${currentTheme.badge}`}>{tag}</Badge>
        </CardHeader>
        <CardContent className="flex-grow">
            <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col sm:grid sm:grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm" className={`w-full ${currentTheme.border}`}>
                <Link href={`/subjects/${id}`}>
                    Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            <Button 
              onClick={(e) => { e.stopPropagation(); onAnalyze(subject); }} 
              variant="default" 
              size="sm" 
              className={`w-full ${currentTheme.primary} border-0 text-white hover:opacity-90`}
            >
                AI Analyze <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
  )
});
SubjectCard.displayName = 'SubjectCard';
