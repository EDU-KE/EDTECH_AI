'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserCurriculum, getCurriculumInfo } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Sparkles, Globe, BookOpen } from 'lucide-react';

interface CurriculumSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete: () => void;
}

type CurriculumType = 'CBE' | '8-4-4' | 'IGCSE';

export function CurriculumSelectionModal({ isOpen, onClose, onComplete }: CurriculumSelectionModalProps) {
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumType | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const curriculums: CurriculumType[] = ['CBE', '8-4-4', 'IGCSE'];

  const handleCurriculumSelect = (curriculum: CurriculumType) => {
    setSelectedCurriculum(curriculum);
    setSelectedGrade(''); // Reset grade selection when curriculum changes
  };

  const handleSave = async () => {
    if (!selectedCurriculum) {
      toast.error('Please select a curriculum');
      return;
    }

    if (!selectedGrade) {
      toast.error('Please select your grade level');
      return;
    }

    setIsLoading(true);
    try {
      await updateUserCurriculum(selectedCurriculum, selectedGrade);
      toast.success('Curriculum preference saved successfully!');
      onComplete();
    } catch (error: any) {
      console.error('Error saving curriculum:', error);
      toast.error(error.message || 'Failed to save curriculum preference');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (onClose) {
      onClose();
    } else {
      onComplete();
    }
  };

  const getCurriculumIcon = (curriculum: CurriculumType) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Choose Your Learning Journey
          </DialogTitle>
          <p className="text-muted-foreground text-center text-lg">
            Select your curriculum to unlock personalized content and assessments
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
                onClick={() => handleCurriculumSelect(curriculum)}
              >
                <CardHeader className="text-center relative overflow-hidden">
                  <div className={`absolute inset-0 ${info.theme.primary} opacity-10`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-3">
                      <div className="text-5xl mb-2">{info.icon}</div>
                      {getCurriculumIcon(curriculum)}
                    </div>
                    <CardTitle className={`text-xl ${info.theme.accent}`}>
                      {info.name}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2 leading-relaxed">
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
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                        <span className="text-xs">📚</span>
                        Key Features:
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {info.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="text-green-500">•</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                        <span className="text-xs">🎓</span>
                        Subjects:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {info.subjects.slice(0, 3).map((subject, index) => (
                          <Badge key={index} variant="secondary" className={`text-xs ${info.theme.badge}`}>
                            {subject}
                          </Badge>
                        ))}
                        {info.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{info.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                        <span className="text-xs">📊</span>
                        Grade Levels:
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {info.grades.length} levels available ({info.grades[0]} - {info.grades[info.grades.length - 1]})
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedCurriculum && (
          <div className={`mt-8 p-6 rounded-xl border-2 ${getCurriculumInfo(selectedCurriculum).theme.border} ${getCurriculumInfo(selectedCurriculum).theme.secondary}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{getCurriculumInfo(selectedCurriculum).icon}</div>
              <div>
                <h3 className={`font-bold text-lg ${getCurriculumInfo(selectedCurriculum).theme.accent}`}>
                  Complete Your Setup
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select your current grade level in the {getCurriculumInfo(selectedCurriculum).name} system
                </p>
              </div>
            </div>
            
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your current grade level..." />
              </SelectTrigger>
              <SelectContent>
                {getCurriculumInfo(selectedCurriculum).grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedGrade && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Ready to personalize your learning experience!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            Skip for Now
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!selectedCurriculum || !selectedGrade || isLoading}
            className={`min-w-[140px] ${selectedCurriculum ? getCurriculumInfo(selectedCurriculum).theme.primary : ''} border-0 text-white font-medium`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Start Learning
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
