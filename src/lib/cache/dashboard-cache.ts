import { Cache } from './cache-utility';

export interface DashboardData {
  recentActivity: any[];
  achievements: any[];
  weeklyProgress: any[];
  studyStreak: number;
  completionRate: number;
  averageScore: number;
  studyTime: number;
  currentGoals: any[];
  upcomingDeadlines: any[];
  subjectPerformance: Array<{
    subject: string;
    score: number;
    progress: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  lastUpdated: number;
}

export interface UserActivityData {
  dailyActivity: Array<{
    date: string;
    studyTime: number;
    exercisesCompleted: number;
    quizzesAttempted: number;
    resourcesViewed: number;
  }>;
  weeklyStats: {
    totalStudyTime: number;
    totalExercises: number;
    totalQuizzes: number;
    averageScore: number;
    progressRate: number;
  };
  monthlyTrends: {
    studyTimeGrowth: number;
    performanceGrowth: number;
    consistencyScore: number;
  };
}

export interface ProficiencyData {
  subjects: Array<{
    name: string;
    proficiency: number;
    recentProgress: number;
    weakAreas: string[];
    strongAreas: string[];
    recommendedActions: string[];
  }>;
  overallProficiency: number;
  proficiencyTrend: 'improving' | 'stable' | 'declining';
}

export interface LearningRecommendations {
  priorityTopics: string[];
  studySchedule: Array<{
    subject: string;
    recommendedTime: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  resources: Array<{
    title: string;
    type: 'video' | 'exercise' | 'quiz' | 'article';
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number;
  }>;
  adaptiveInsights: string[];
}

class DashboardCacheManager {
  private cache: Cache<any>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly LONG_TTL = 15 * 60 * 1000; // 15 minutes for stable data
  private readonly SHORT_TTL = 2 * 60 * 1000; // 2 minutes for frequently changing data

  constructor() {
    this.cache = new Cache<any>({
      maxSize: 200,
      ttl: this.DEFAULT_TTL
    });
  }

  // Dashboard data caching
  async getDashboardData(userId: string): Promise<DashboardData | null> {
    const key = `dashboard_${userId}`;
    return this.cache.get(key);
  }

  async cacheDashboardData(userId: string, data: DashboardData): Promise<void> {
    const key = `dashboard_${userId}`;
    const dataWithTimestamp = {
      ...data,
      lastUpdated: Date.now()
    };
    this.cache.set(key, dataWithTimestamp, this.DEFAULT_TTL);
  }

  // User activity data caching
  async getUserActivityData(userId: string): Promise<UserActivityData | null> {
    const key = `activity_${userId}`;
    return this.cache.get(key);
  }

  async cacheUserActivityData(userId: string, data: UserActivityData): Promise<void> {
    const key = `activity_${userId}`;
    this.cache.set(key, data, this.LONG_TTL);
  }

  // Proficiency data caching
  async getProficiencyData(userId: string): Promise<ProficiencyData | null> {
    const key = `proficiency_${userId}`;
    return this.cache.get(key);
  }

  async cacheProficiencyData(userId: string, data: ProficiencyData): Promise<void> {
    const key = `proficiency_${userId}`;
    this.cache.set(key, data, this.LONG_TTL);
  }

  // Learning recommendations caching
  async getLearningRecommendations(userId: string): Promise<LearningRecommendations | null> {
    const key = `recommendations_${userId}`;
    return this.cache.get(key);
  }

  async cacheLearningRecommendations(userId: string, data: LearningRecommendations): Promise<void> {
    const key = `recommendations_${userId}`;
    this.cache.set(key, data, this.LONG_TTL);
  }

  // Subject-specific data caching
  async getSubjectData(userId: string, subject: string): Promise<any> {
    const key = `subject_${userId}_${subject}`;
    return this.cache.get(key);
  }

  async cacheSubjectData(userId: string, subject: string, data: any): Promise<void> {
    const key = `subject_${userId}_${subject}`;
    this.cache.set(key, data, this.DEFAULT_TTL);
  }

  // Recent activity caching (short-lived)
  async getRecentActivity(userId: string): Promise<any[]> {
    const key = `recent_activity_${userId}`;
    return this.cache.get(key) || [];
  }

  async cacheRecentActivity(userId: string, activities: any[]): Promise<void> {
    const key = `recent_activity_${userId}`;
    this.cache.set(key, activities, this.SHORT_TTL);
  }

  // Batch operations for efficient data loading
  async batchGetDashboardData(userId: string): Promise<{
    dashboard: DashboardData | null;
    activity: UserActivityData | null;
    proficiency: ProficiencyData | null;
    recommendations: LearningRecommendations | null;
  }> {
    const [dashboard, activity, proficiency, recommendations] = await Promise.all([
      this.getDashboardData(userId),
      this.getUserActivityData(userId),
      this.getProficiencyData(userId),
      this.getLearningRecommendations(userId)
    ]);

    return { dashboard, activity, proficiency, recommendations };
  }

  async batchCacheDashboardData(userId: string, data: {
    dashboard?: DashboardData;
    activity?: UserActivityData;
    proficiency?: ProficiencyData;
    recommendations?: LearningRecommendations;
  }): Promise<void> {
    const promises = [];

    if (data.dashboard) {
      promises.push(this.cacheDashboardData(userId, data.dashboard));
    }
    if (data.activity) {
      promises.push(this.cacheUserActivityData(userId, data.activity));
    }
    if (data.proficiency) {
      promises.push(this.cacheProficiencyData(userId, data.proficiency));
    }
    if (data.recommendations) {
      promises.push(this.cacheLearningRecommendations(userId, data.recommendations));
    }

    await Promise.all(promises);
  }

  // Cache invalidation methods
  invalidateUserData(userId: string): void {
    const patterns = [
      `dashboard_${userId}`,
      `activity_${userId}`,
      `proficiency_${userId}`,
      `recommendations_${userId}`,
      `recent_activity_${userId}`
    ];

    patterns.forEach(pattern => {
      this.cache.delete(pattern);
    });

    // Also invalidate subject-specific data
    this.cache.keys().forEach((key: string) => {
      if (key.startsWith(`subject_${userId}_`)) {
        this.cache.delete(key);
      }
    });
  }

  invalidateSubjectData(userId: string, subject: string): void {
    const key = `subject_${userId}_${subject}`;
    this.cache.delete(key);
    
    // Also invalidate related dashboard data
    this.cache.delete(`dashboard_${userId}`);
    this.cache.delete(`proficiency_${userId}`);
  }

  // Preload data for better performance
  async preloadDashboardData(userId: string, dataLoader: () => Promise<any>): Promise<void> {
    const existingData = await this.getDashboardData(userId);
    if (!existingData) {
      try {
        const data = await dataLoader();
        await this.cacheDashboardData(userId, data);
      } catch (error) {
        console.error('Error preloading dashboard data:', error);
      }
    }
  }

  // Cache warming for multiple users
  async warmCache(userIds: string[], dataLoader: (userId: string) => Promise<DashboardData>): Promise<void> {
    const promises = userIds.map(async (userId) => {
      const existingData = await this.getDashboardData(userId);
      if (!existingData) {
        try {
          const data = await dataLoader(userId);
          await this.cacheDashboardData(userId, data);
        } catch (error) {
          console.error(`Error warming cache for user ${userId}:`, error);
        }
      }
    });

    await Promise.all(promises);
  }

  // Analytics and monitoring
  getStats() {
    return this.cache.getStats();
  }

  getCacheStatus(): {
    size: number;
    hitRate: number;
    totalAccess: number;
    averageAge: number;
  } {
    const stats = this.cache.getStats();
    return {
      size: stats.size,
      hitRate: stats.hitRate,
      totalAccess: stats.totalAccess,
      averageAge: stats.averageAge
    };
  }

  // Clear all cached data
  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup(): void {
    this.cache.cleanup();
  }
}

// Export singleton instance
export const dashboardCache = new DashboardCacheManager();

// Helper function to create cache key
export function createCacheKey(prefix: string, userId: string, suffix?: string): string {
  return suffix ? `${prefix}_${userId}_${suffix}` : `${prefix}_${userId}`;
}

// Debounced cache invalidation
let invalidationTimeout: NodeJS.Timeout;

export function debouncedInvalidation(userId: string, delay: number = 1000): void {
  if (invalidationTimeout) {
    clearTimeout(invalidationTimeout);
  }
  
  invalidationTimeout = setTimeout(() => {
    dashboardCache.invalidateUserData(userId);
  }, delay);
}
