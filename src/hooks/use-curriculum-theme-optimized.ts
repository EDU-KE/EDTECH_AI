'use client';

import { useAuth } from '@/lib/auth-context';
import { getUserProfile, getCurriculumInfo } from '@/lib/auth';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { componentCache } from '@/lib/cache/cache-utility';

export interface CurriculumTheme {
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  ring: string;
  badge: string;
  hover: string;
}

export interface CurriculumThemeContext {
  theme: CurriculumTheme | null;
  curriculum: 'CBE' | '8-4-4' | 'IGCSE' | null;
  isLoading: boolean;
  curriculumInfo: ReturnType<typeof getCurriculumInfo> | null;
  refresh: () => Promise<void>;
}

// Event system for curriculum changes
let curriculumChangeListeners: Array<() => void> = [];

export const triggerCurriculumChange = () => {
  // Clear cache when curriculum changes
  componentCache.clear();
  curriculumChangeListeners.forEach(listener => listener());
};

const addCurriculumChangeListener = (listener: () => void) => {
  curriculumChangeListeners.push(listener);
  return () => {
    curriculumChangeListeners = curriculumChangeListeners.filter(l => l !== listener);
  };
};

export function useCurriculumTheme(): CurriculumThemeContext {
  const { user } = useAuth();
  const [theme, setTheme] = useState<CurriculumTheme | null>(null);
  const [curriculum, setCurriculum] = useState<'CBE' | '8-4-4' | 'IGCSE' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [curriculumInfo, setCurriculumInfo] = useState<ReturnType<typeof getCurriculumInfo> | null>(null);

  // Memoized cache key
  const cacheKey = useMemo(() => 
    user?.uid ? `curriculum_theme_${user.uid}` : null, 
    [user?.uid]
  );

  const loadCurriculumTheme = useCallback(async () => {
    if (!user?.uid || !cacheKey) {
      setTheme(null);
      setCurriculum(null);
      setCurriculumInfo(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Try to get from cache first
      const cachedData = componentCache.get(cacheKey);
      if (cachedData) {
        setTheme(cachedData.theme);
        setCurriculum(cachedData.curriculum);
        setCurriculumInfo(cachedData.curriculumInfo);
        setIsLoading(false);
        return;
      }

      // Fetch from API
      const profile = await getUserProfile(user.uid);
      if (profile?.curriculum) {
        const info = getCurriculumInfo(profile.curriculum);
        
        // Cache the result
        const dataToCache = {
          theme: info.theme,
          curriculum: profile.curriculum,
          curriculumInfo: info
        };
        componentCache.set(cacheKey, dataToCache, 10 * 60 * 1000); // Cache for 10 minutes
        
        setCurriculum(profile.curriculum);
        setTheme(info.theme);
        setCurriculumInfo(info);
      } else {
        setTheme(null);
        setCurriculum(null);
        setCurriculumInfo(null);
      }
    } catch (error) {
      console.error('Error loading curriculum theme:', error);
      setTheme(null);
      setCurriculum(null);
      setCurriculumInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, cacheKey]);

  useEffect(() => {
    loadCurriculumTheme();
  }, [loadCurriculumTheme]);

  // Listen for curriculum changes
  useEffect(() => {
    const removeListener = addCurriculumChangeListener(() => {
      loadCurriculumTheme();
    });
    return removeListener;
  }, [loadCurriculumTheme]);

  const refresh = useCallback(async () => {
    if (cacheKey) {
      componentCache.delete(cacheKey);
    }
    await loadCurriculumTheme();
  }, [loadCurriculumTheme, cacheKey]);

  return {
    theme,
    curriculum,
    isLoading,
    curriculumInfo,
    refresh
  };
}

// Default theme for when no curriculum is selected
export const defaultTheme: CurriculumTheme = {
  primary: 'bg-gradient-to-br from-gray-500 to-gray-600',
  secondary: 'bg-gray-50 dark:bg-gray-950/20',
  accent: 'text-gray-700 dark:text-gray-300',
  border: 'border-gray-200 dark:border-gray-800',
  ring: 'ring-gray-500',
  badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  hover: 'hover:bg-gray-100 dark:hover:bg-gray-900/20'
};

// Helper function to get theme or default
export function getThemeOrDefault(theme: CurriculumTheme | null): CurriculumTheme {
  return theme || defaultTheme;
}
