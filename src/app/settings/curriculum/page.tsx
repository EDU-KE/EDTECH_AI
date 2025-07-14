'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUserProfile, updateUserCurriculum, getCurriculumInfo, type UserProfile } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2, BookOpen, GraduationCap, Settings } from 'lucide-react';

export default function CurriculumSettingsPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | ''>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const curriculums: ('CBE' | '8-4-4' | 'IGCSE')[] = ['CBE', '8-4-4', 'IGCSE'];

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          if (profile?.curriculum) {
            setSelectedCurriculum(profile.curriculum);
          }
          if (profile?.gradeLevel) {
            setSelectedGrade(profile.gradeLevel);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast.error('Failed to load profile');
        }
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleCurriculumChange = (curriculum: 'CBE' | '8-4-4' | 'IGCSE') => {
    setSelectedCurriculum(curriculum);
    setSelectedGrade(''); // Reset grade when curriculum changes
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

    setIsSaving(true);
    try {
      await updateUserCurriculum(selectedCurriculum, selectedGrade);
      toast.success('Curriculum settings updated successfully!');
      
      // Refresh profile
      if (user?.uid) {
        const updatedProfile = await getUserProfile(user.uid);
        setUserProfile(updatedProfile);
      }
    } catch (error: any) {
      console.error('Error updating curriculum:', error);
      toast.error(error.message || 'Failed to update curriculum settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to access curriculum settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Curriculum Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Customize your learning experience by selecting your curriculum and grade level.
        </p>
      </div>

      {/* Current Settings */}
      {userProfile?.curriculum && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Current Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Curriculum</h4>
                <Badge variant="default" className="text-sm">
                  {getCurriculumInfo(userProfile.curriculum).name}
                </Badge>
              </div>
              {userProfile.gradeLevel && (
                <div>
                  <h4 className="font-medium mb-2">Grade Level</h4>
                  <Badge variant="outline" className="text-sm">
                    {userProfile.gradeLevel}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Curriculum Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Select Curriculum
          </CardTitle>
          <CardDescription>
            Choose the curriculum that matches your educational system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curriculums.map((curriculum) => {
              const info = getCurriculumInfo(curriculum);
              const isSelected = selectedCurriculum === curriculum;

              return (
                <Card
                  key={curriculum}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => handleCurriculumChange(curriculum)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="text-2xl mb-1">{info.icon}</div>
                    <CardTitle className="text-sm">{info.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground text-center">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grade Selection */}
      {selectedCurriculum && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Grade Level</CardTitle>
            <CardDescription>
              Choose your current grade level in the {getCurriculumInfo(selectedCurriculum).name} system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-80">
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
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={!selectedCurriculum || !selectedGrade || isSaving}
          className="min-w-[140px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
}
