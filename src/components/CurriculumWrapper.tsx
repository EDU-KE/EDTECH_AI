'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { CurriculumSelectionModal } from './CurriculumSelectionModal';
import { getUserProfile, needsCurriculumSelection, type UserProfile } from '@/lib/auth';
import { useCurriculum } from './CurriculumContext';

export function CurriculumWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isModalOpen, hideModal, showModal } = useCurriculum();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  const checkCurriculumStatus = async () => {
    if (!user?.uid || authLoading) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Checking curriculum status for user:', user.uid);
      const profile = await getUserProfile(user.uid);
      console.log('User profile:', profile);
      setUserProfile(profile);
      
      const needsSelection = needsCurriculumSelection(profile);
      console.log('Needs curriculum selection:', needsSelection);
      
      if (needsSelection) {
        console.log('Showing curriculum modal');
        showModal();
      }
      setHasChecked(true);
    } catch (error) {
      console.error('Error checking curriculum status:', error);
      setHasChecked(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when user changes
    if (!user) {
      hideModal();
      setUserProfile(null);
      setHasChecked(false);
      setIsLoading(false);
      return;
    }

    // Only check if we haven't checked yet and auth is not loading
    if (!hasChecked && !authLoading) {
      checkCurriculumStatus();
    }
  }, [user, authLoading, hasChecked]);

  const handleCurriculumComplete = async () => {
    console.log('Curriculum selection completed');
    hideModal();
    setHasChecked(false); // Allow re-checking
    // Refresh the profile to get updated data
    await checkCurriculumStatus();
  };

  const handleCurriculumSkip = () => {
    console.log('Curriculum selection skipped');
    hideModal();
    // Don't reset hasChecked so we remember they skipped this session
  };

  // Show loading while auth or curriculum check is in progress
  if (authLoading || (isLoading && !hasChecked)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {user && (
        <CurriculumSelectionModal
          isOpen={isModalOpen}
          onClose={handleCurriculumSkip}
          onComplete={handleCurriculumComplete}
        />
      )}
    </>
  );
}
