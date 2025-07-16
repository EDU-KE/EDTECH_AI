/**
 * Progress Cache System
 * Optimizes performance by caching frequently accessed progress data
 */

import { progressData, subjects } from "@/lib/mock-data";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface ProgressStats {
  average: number;
  highest: number;
  bestMonth: string;
}

interface SubjectProgressData {
  month: string;
  progress: number;
}

class ProgressCacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private static instance: ProgressCacheManager;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): ProgressCacheManager {
    if (!ProgressCacheManager.instance) {
      ProgressCacheManager.instance = new ProgressCacheManager();
    }
    return ProgressCacheManager.instance;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  public getSubjectProgress(subject: string): SubjectProgressData[] | null {
    const key = `subject_progress_${subject}`;
    let data = this.get<SubjectProgressData[]>(key);
    
    if (!data) {
      if (subject === 'all') {
        data = this.calculateAllSubjectsProgress();
      } else {
        data = progressData[subject as keyof typeof progressData] || [];
      }
      this.set(key, data);
    }
    
    return data;
  }

  private calculateAllSubjectsProgress(): SubjectProgressData[] {
    const combinedData: { [month: string]: { total: number, count: number } } = {};
    
    Object.values(progressData).forEach(subjectData => {
      subjectData.forEach(monthData => {
        if (!combinedData[monthData.month]) {
          combinedData[monthData.month] = { total: 0, count: 0 };
        }
        combinedData[monthData.month].total += monthData.progress;
        combinedData[monthData.month].count++;
      });
    });

    return Object.entries(combinedData).map(([month, data]) => ({
      month,
      progress: data.count > 0 ? Math.round(data.total / data.count) : 0,
    }));
  }

  public getProgressStats(subject: string): ProgressStats | null {
    const key = `progress_stats_${subject}`;
    let stats = this.get<ProgressStats>(key);
    
    if (!stats) {
      const progressData = this.getSubjectProgress(subject);
      if (progressData && progressData.length > 0) {
        const totalProgress = progressData.reduce((acc, curr) => acc + curr.progress, 0);
        const average = totalProgress / progressData.length;
        const highest = Math.max(...progressData.map(p => p.progress));
        const bestMonth = progressData.find(p => p.progress === highest)?.month || "N/A";
        
        stats = { average, highest, bestMonth };
        this.set(key, stats);
      }
    }
    
    return stats;
  }

  public getTopSubject(): string | null {
    const key = 'top_subject';
    let topSubject = this.get<string>(key);
    
    if (!topSubject) {
      let maxAverage = -1;
      let bestSubject = "math";
      
      for (const key in progressData) {
        const subjectKey = key as keyof typeof progressData;
        const data = progressData[subjectKey];
        if (data.length > 0) {
          const avg = data.reduce((acc, curr) => acc + curr.progress, 0) / data.length;
          if (avg > maxAverage) {
            maxAverage = avg;
            bestSubject = subjectKey;
          }
        }
      }
      
      topSubject = bestSubject;
      this.set(key, topSubject, 2 * 60 * 1000); // Cache for 2 minutes
    }
    
    return topSubject;
  }

  public getInsights(subject: string): string | null {
    const key = `insights_${subject}`;
    return this.get<string>(key);
  }

  public setInsights(subject: string, insights: string): void {
    const key = `insights_${subject}`;
    this.set(key, insights, 10 * 60 * 1000); // Cache insights for 10 minutes
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public invalidateSubject(subject: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(subject) || key === 'top_subject'
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const ProgressCache = ProgressCacheManager.getInstance();
