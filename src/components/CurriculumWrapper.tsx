'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { CurriculumSelectionModal } from './CurriculumSelectionModal';
import { getUserProfile, needsCurriculumSelection, type UserProfile } from '@/lib/auth';

export function CurriculumWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCurriculumStatus = async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      
      const needsSelection = needsCurriculumSelection(profile);
      if (needsSelection) {
        setShowCurriculumModal(true);
      }
    } catch (error) {
      console.error('Error checking curriculum status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCurriculumStatus();
  }, [user]);

  const handleCurriculumComplete = async () => {
    setShowCurriculumModal(false);
    // Refresh the profile to get updated data
    await checkCurriculumStatus();
  };

  if (isLoading) {
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
          isOpen={showCurriculumModal}
          onClose={() => setShowCurriculumModal(false)}
          onComplete={handleCurriculumComplete}
        />
      )}
    </>
  );
}
