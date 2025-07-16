'use client';

import { useState, useCallback, useMemo } from 'react';
import { Check, BookOpen, Users, Globe, Trophy, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurriculumInfo } from '@/lib/auth';
import { componentCache } from '@/lib/cache/cache-utility';

interface CurriculumOption {
  id: 'CBE' | '8-4-4' | 'IGCSE';
  name: string;
  description: string;
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  subjects: string[];
  icon: React.ReactNode;
}

const curriculumOptions: CurriculumOption[] = [
  {
    id: 'CBE',
    name: 'Competency-Based Education',
    description: 'Modern outcome-focused learning approach that emphasizes skill mastery',
    features: [
      'Skill-based learning',
      'Flexible pacing',
      'Real-world applications',
      'Continuous assessment',
      'Industry-relevant skills'
    ],
    difficulty: 'Intermediate',
    duration: '3-4 years',
    subjects: ['Mathematics', 'Science', 'Languages', 'Technology', 'Arts'],
    icon: <Trophy className="w-6 h-6" />
  },
  {
    id: '8-4-4',
    name: 'Kenyan 8-4-4 System',
    description: 'Traditional Kenyan education system with comprehensive foundation',
    features: [
      'Structured curriculum',
      'National examinations',
      'Broad subject coverage',
      'Standardized progression',
      'Cultural integration'
    ],
    difficulty: 'Beginner',
    duration: '12 years',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Sciences', 'Humanities'],
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: 'IGCSE',
    name: 'International GCSE',
    description: 'Globally recognized qualification for international students',
    features: [
      'International standards',
      'University preparation',
      'Flexible subject choices',
      'Critical thinking focus',
      'Global recognition'
    ],
    difficulty: 'Advanced',
    duration: '2-3 years',
    subjects: ['Mathematics', 'English', 'Sciences', 'Languages', 'Humanities'],
    icon: <Globe className="w-6 h-6" />
  }
];

interface CurriculumThemeSelectorProps {
  currentCurriculum?: 'CBE' | '8-4-4' | 'IGCSE';
  onSelect: (curriculum: 'CBE' | '8-4-4' | 'IGCSE') => void;
  isLoading?: boolean;
  className?: string;
}

export default function CurriculumThemeSelector({
  currentCurriculum,
  onSelect,
  isLoading = false,
  className = ''
}: CurriculumThemeSelectorProps) {
  const [selectedCurriculum, setSelectedCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | null>(
    currentCurriculum || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized curriculum themes
  const curriculumThemes = useMemo(() => {
    const cacheKey = 'curriculum_themes';
    const cached = componentCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const themes = {
      CBE: getCurriculumInfo('CBE'),
      '8-4-4': getCurriculumInfo('8-4-4'),
      IGCSE: getCurriculumInfo('IGCSE')
    };

    componentCache.set(cacheKey, themes, 30 * 60 * 1000); // Cache for 30 minutes
    return themes;
  }, []);

  const handleSelection = useCallback((curriculum: 'CBE' | '8-4-4' | 'IGCSE') => {
    setSelectedCurriculum(curriculum);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedCurriculum) return;

    setIsSubmitting(true);
    try {
      await onSelect(selectedCurriculum);
      // Clear cache to ensure fresh data
      componentCache.delete('curriculum_themes');
    } catch (error) {
      console.error('Error selecting curriculum:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedCurriculum, onSelect]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Learning Path</h2>
        <p className="text-muted-foreground">Select a curriculum that matches your educational goals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {curriculumOptions.map((option) => {
          const isSelected = selectedCurriculum === option.id;
          const theme = curriculumThemes[option.id];
          const isCurrentCurriculum = currentCurriculum === option.id;

          return (
            <div
              key={option.id}
              className="transform transition-all duration-200 hover:scale-105"
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? `ring-2 ${theme.ring} bg-gradient-to-br ${theme.primary.replace('bg-gradient-to-br', '')} text-white` 
                    : 'hover:shadow-lg border-2 border-transparent hover:border-gray-200'
                } ${isCurrentCurriculum ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleSelection(option.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : theme.secondary}`}>
                      {option.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrentCurriculum && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                      {isSelected && (
                        <div className="p-1 rounded-full bg-white/20 transform transition-transform duration-200">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className={`text-lg ${isSelected ? 'text-white' : ''}`}>
                    {option.name}
                  </CardTitle>
                  <CardDescription className={`text-sm ${isSelected ? 'text-white/80' : ''}`}>
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(option.difficulty)}>
                      {option.difficulty}
                    </Badge>
                    <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {option.duration}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                      Key Features:
                    </h4>
                    <ul className="space-y-1">
                      {option.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className={`text-xs flex items-center gap-2 ${
                          isSelected ? 'text-white/80' : 'text-muted-foreground'
                        }`}>
                          <Star className="w-3 h-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                      Subjects:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {option.subjects.slice(0, 3).map((subject, index) => (
                        <Badge
                          key={index}
                          variant={isSelected ? 'secondary' : 'outline'}
                          className={`text-xs ${isSelected ? 'bg-white/20 text-white border-white/30' : ''}`}
                        >
                          {subject}
                        </Badge>
                      ))}
                      {option.subjects.length > 3 && (
                        <Badge
                          variant={isSelected ? 'secondary' : 'outline'}
                          className={`text-xs ${isSelected ? 'bg-white/20 text-white border-white/30' : ''}`}
                        >
                          +{option.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {selectedCurriculum && (
        <div className="text-center transform transition-all duration-200">
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying Changes...
              </>
            ) : (
              <>
                Continue with {curriculumOptions.find(c => c.id === selectedCurriculum)?.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
