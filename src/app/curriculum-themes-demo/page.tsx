'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurriculumInfo } from '@/lib/auth';
import { CheckCircle, Sparkles, Globe, BookOpen, ArrowRight } from 'lucide-react';

export default function CurriculumThemesDemo() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | null>(null);
  
  const curriculums: ('CBE' | '8-4-4' | 'IGCSE')[] = ['CBE', '8-4-4', 'IGCSE'];

  const getCurriculumIcon = (curriculum: 'CBE' | '8-4-4' | 'IGCSE') => {
    switch (curriculum) {
      case 'CBE':
        return <Sparkles className="w-6 h-6 text-purple-500" />;
      case '8-4-4':
        return <BookOpen className="w-6 h-6 text-green-500" />;
      case 'IGCSE':
        return <Globe className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Enhanced Curriculum Themes
        </h1>
        <p className="text-lg text-muted-foreground">
          Experience the new themed curriculum selection system with unique visual identities
        </p>
      </div>

      {/* Theme Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Theme Features
          </CardTitle>
          <CardDescription>
            Each curriculum now has its own unique visual theme and identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">CBE - Purple Theme</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Modern, skills-focused approach</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">8-4-4 - Green Theme</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Traditional, structured learning</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">IGCSE - Blue Theme</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">International, flexible system</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interactive Theme Selection</CardTitle>
          <CardDescription>
            Click on a curriculum to see its themed presentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curriculums.map((curriculum) => {
              const info = getCurriculumInfo(curriculum);
              const isSelected = selectedCurriculum === curriculum;

              return (
                <Card
                  key={curriculum}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                    isSelected 
                      ? `ring-2 ${info.theme.ring} border-transparent shadow-lg ${info.theme.secondary}` 
                      : `hover:shadow-md ${info.theme.hover}`
                  }`}
                  onClick={() => setSelectedCurriculum(curriculum)}
                >
                  <CardHeader className="text-center relative overflow-hidden">
                    <div className={`absolute inset-0 ${info.theme.primary} opacity-10`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="text-4xl">{info.icon}</div>
                        {getCurriculumIcon(curriculum)}
                      </div>
                      <CardTitle className={`text-lg ${info.theme.accent}`}>
                        {info.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {info.description}
                      </CardDescription>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {info.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className={`text-xs ${info.theme.badge}`}>
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Subjects:</h4>
                        <p className="text-xs text-muted-foreground">
                          {info.subjects.length} subjects including {info.subjects.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Curriculum Details */}
      {selectedCurriculum && (
        <Card className={`${getCurriculumInfo(selectedCurriculum).theme.secondary} border-2 ${getCurriculumInfo(selectedCurriculum).theme.border}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${getCurriculumInfo(selectedCurriculum).theme.accent}`}>
              <div className="text-2xl">{getCurriculumInfo(selectedCurriculum).icon}</div>
              {getCurriculumInfo(selectedCurriculum).name} Details
            </CardTitle>
            <CardDescription>
              Complete overview of the {selectedCurriculum} curriculum system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">All Features</h4>
                <div className="space-y-2">
                  {getCurriculumInfo(selectedCurriculum).features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">All Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {getCurriculumInfo(selectedCurriculum).subjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className={`text-xs ${getCurriculumInfo(selectedCurriculum).theme.badge}`}>
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3">Grade Levels</h4>
              <div className="flex flex-wrap gap-2">
                {getCurriculumInfo(selectedCurriculum).grades.map((grade, index) => (
                  <Badge key={index} variant="secondary" className={`text-xs ${getCurriculumInfo(selectedCurriculum).theme.badge}`}>
                    {grade}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Implementation Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Implementation Guide
          </CardTitle>
          <CardDescription>
            How the new themed curriculum system works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Enhanced Data Structure</h4>
                <p className="text-sm text-muted-foreground">
                  Each curriculum now includes theme colors, features, and enhanced metadata
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Visual Identity</h4>
                <p className="text-sm text-muted-foreground">
                  Unique color schemes, gradients, and styling for each curriculum type
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Consistent Application</h4>
                <p className="text-sm text-muted-foreground">
                  Themes applied across selection modal, settings, profile, and other components
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
