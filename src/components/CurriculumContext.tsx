'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CurriculumContextType {
  showModal: () => void;
  hideModal: () => void;
  isModalOpen: boolean;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  return (
    <CurriculumContext.Provider value={{ showModal, hideModal, isModalOpen }}>
      {children}
    </CurriculumContext.Provider>
  );
}

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
};
