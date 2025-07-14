'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile, needsCurriculumSelection, type UserProfile } from '@/lib/auth';

interface CurriculumContextType {
  showCurriculumModal: boolean;
  setShowCurriculumModal: (show: boolean) => void;
  userProfile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  needsSelection: boolean;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [needsSelection, setNeedsSelection] = useState(false);

  const refreshProfile = async () => {
    if (user?.uid) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        
        const needsCurriculum = needsCurriculumSelection(profile);
        setNeedsSelection(needsCurriculum);
        
        // Show modal if user needs curriculum selection
        if (needsCurriculum && !showCurriculumModal) {
          setShowCurriculumModal(true);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      setUserProfile(null);
      setNeedsSelection(false);
      setShowCurriculumModal(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [user]);

  const value = {
    showCurriculumModal,
    setShowCurriculumModal,
    userProfile,
    refreshProfile,
    needsSelection
  };

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}
