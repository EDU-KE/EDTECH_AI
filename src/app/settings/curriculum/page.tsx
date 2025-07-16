'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUserProfile, updateUserCurriculum, getCurriculumInfo, type UserProfile } from '@/lib/auth';
import { useCurriculumTheme } from '@/hooks/use-curriculum-theme';
import { ThemeUpdateDemo } from '@/components/theme-update-demo';
import { toast } from 'sonner';
import { Loader2, BookOpen, GraduationCap, Settings, Palette, CheckCircle, RefreshCw } from 'lucide-react';

export default function CurriculumSettingsPage() {
  const { user } = useAuth();
  const { theme, curriculum: currentCurriculum, refresh: refreshTheme } = useCurriculumTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | ''>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewCurriculum, setPreviewCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | null>(null);

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
    setPreviewCurriculum(curriculum); // Set preview for theme
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
      
      // Show success message with theme update info
      toast.success('Curriculum settings updated successfully! Theme applied across all components.');
      
      // Refresh profile
      if (user?.uid) {
        const updatedProfile = await getUserProfile(user.uid);
        setUserProfile(updatedProfile);
      }
      
      // Reset preview state
      setPreviewCurriculum(null);
      
      // Force refresh theme (should happen automatically, but ensures consistency)
      await refreshTheme();
      
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

      {/* Theme Preview */}
      {(currentCurriculum || previewCurriculum) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Preview
              {previewCurriculum && previewCurriculum !== currentCurriculum && (
                <Badge variant="outline" className="ml-2">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Preview Mode
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {previewCurriculum && previewCurriculum !== currentCurriculum 
                ? `Previewing ${getCurriculumInfo(previewCurriculum).name} theme - save to apply across all components`
                : `Current ${getCurriculumInfo(currentCurriculum!).name} theme applied across all components`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const displayCurriculum = previewCurriculum || currentCurriculum!;
              const info = getCurriculumInfo(displayCurriculum);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Color Palette</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${info.theme.primary}`} />
                          <span className="text-sm text-muted-foreground">Primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${info.theme.secondary} border`} />
                          <span className="text-sm text-muted-foreground">Secondary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 ${info.theme.border}`} />
                          <span className="text-sm text-muted-foreground">Border</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Component Preview</p>
                      <Card className={`border-2 ${info.theme.border} ${info.theme.hover}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded ${info.theme.secondary}`}>
                              <BookOpen className={`w-4 h-4 ${info.theme.accent}`} />
                            </div>
                            <div>
                              <CardTitle className={`text-sm ${info.theme.accent}`}>Sample Component</CardTitle>
                              <Badge variant="secondary" className={`text-xs ${info.theme.badge}`}>
                                {displayCurriculum}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button size="sm" className={`${info.theme.primary} text-white border-0 hover:opacity-90`}>
                            Themed Button
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Live Theme Demo */}
      <ThemeUpdateDemo />

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
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    isSelected 
                      ? `ring-2 ${info.theme.ring} border-transparent shadow-lg ${info.theme.secondary}` 
                      : `hover:shadow-md ${info.theme.hover}`
                  }`}
                  onClick={() => handleCurriculumChange(curriculum)}
                >
                  <CardHeader className="text-center pb-3 relative overflow-hidden">
                    <div className={`absolute inset-0 ${info.theme.primary} opacity-10`} />
                    <div className="relative z-10">
                      <div className="text-3xl mb-2">{info.icon}</div>
                      <CardTitle className={`text-sm ${info.theme.accent}`}>{info.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      {info.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {info.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className={`text-xs ${info.theme.badge}`}>
                          {feature}
                        </Badge>
                      ))}
                    </div>
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
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        {previewCurriculum && previewCurriculum !== currentCurriculum && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4" />
            <span>Theme will be applied across all components</span>
          </div>
        )}
        <Button 
          onClick={handleSave}
          disabled={!selectedCurriculum || !selectedGrade || isSaving}
          className="min-w-[140px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving & Applying Theme...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
