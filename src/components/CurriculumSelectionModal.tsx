'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserCurriculum, getCurriculumInfo } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Learning Path
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            Select your curriculum to get personalized content and assessments
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {curriculums.map((curriculum) => {
            const info = getCurriculumInfo(curriculum);
            const isSelected = selectedCurriculum === curriculum;

            return (
              <Card
                key={curriculum}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => handleCurriculumSelect(curriculum)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{info.icon}</div>
                  <CardTitle className="text-lg">{info.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {info.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Subjects:</h4>
                      <div className="flex flex-wrap gap-1">
                        {info.subjects.slice(0, 4).map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {info.subjects.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{info.subjects.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Grade Levels:</h4>
                      <p className="text-xs text-muted-foreground">
                        {info.grades.length} levels available
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedCurriculum && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-3">Select Your Grade Level</h3>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your current grade..." />
              </SelectTrigger>
              <SelectContent>
                {getCurriculumInfo(selectedCurriculum).grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            disabled={isLoading}
          >
            Skip for Now
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!selectedCurriculum || !selectedGrade || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
