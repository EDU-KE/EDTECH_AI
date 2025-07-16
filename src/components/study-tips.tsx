'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurriculumTheme } from "@/hooks/use-curriculum-theme";
import { Lightbulb, ArrowRight, Star, CheckCircle } from "lucide-react";
import { useState } from "react";

const studyTips = {
  'CBE': [
    "Focus on competency-based outcomes and skills mastery",
    "Use project-based learning approaches",
    "Track progress through skill demonstrations",
    "Emphasize practical application over memorization",
    "Create portfolios of your work and achievements"
  ],
  '8-4-4': [
    "Follow structured subject-based study schedules",
    "Practice past exam papers regularly",
    "Master foundational concepts before advancing",
    "Use traditional note-taking and revision methods",
    "Focus on comprehensive subject coverage"
  ],
  'IGCSE': [
    "Develop international perspective in your studies",
    "Practice analytical and critical thinking skills",
    "Use variety of assessment methods and formats",
    "Focus on practical applications and real-world connections",
    "Build strong English language proficiency"
  ]
};

export function StudyTips() {
  const { theme, curriculum, curriculumInfo, isLoading } = useCurriculumTheme();
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  if (isLoading || !curriculum) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Loading personalized study tips...
          </p>
        </CardContent>
      </Card>
    );
  }

  const tips = studyTips[curriculum] || [];

  return (
    <Card className={`mb-6 border-2 ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:shadow-md'} transition-all duration-200`}>
      <CardHeader className={`${theme?.secondary || 'bg-gray-50'} border-b`}>
        <CardTitle className={`flex items-center gap-2 ${theme?.accent || 'text-gray-900'}`}>
          <Lightbulb className={`h-5 w-5 ${theme?.accent || 'text-yellow-600'}`} />
          Study Tips
          <Badge variant="outline" className={`ml-2 ${theme?.badge || 'bg-gray-100'}`}>
            {curriculum}
          </Badge>
        </CardTitle>
        <CardDescription>
          Personalized study strategies for {curriculumInfo?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${theme?.border || 'border-gray-200'} ${theme?.hover || 'hover:bg-gray-50'} transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${theme?.secondary || 'bg-gray-100'} mt-0.5`}>
                  <Star className={`h-3 w-3 ${theme?.accent || 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{tip}</p>
                  {expandedTip === index && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        This tip is specifically designed for {curriculumInfo?.name} students to maximize learning effectiveness.
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                  className={`h-6 w-6 p-0 ${theme?.hover || 'hover:bg-gray-100'}`}
                >
                  <ArrowRight className={`h-3 w-3 transition-transform ${expandedTip === index ? 'rotate-90' : ''}`} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Tips updated based on your {curriculum} curriculum</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
