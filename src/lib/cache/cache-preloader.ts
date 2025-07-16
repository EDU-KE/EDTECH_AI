import { componentCache, apiCache, uiCache } from './cache-utility';
import { ProgressCache } from './progress-cache';
import { dashboardCache } from './dashboard-cache';

export interface PreloadStrategy {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  loader: () => Promise<void>;
  dependencies?: string[];
  estimatedTime?: number;
}

export class CachePreloader {
  private strategies: Map<string, PreloadStrategy> = new Map();
  private loading: Set<string> = new Set();
  private completed: Set<string> = new Set();
  private failed: Set<string> = new Set();

  constructor() {
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies() {
    // User profile and curriculum theme preloading
    this.register({
      id: 'user-profile',
      name: 'User Profile & Curriculum Theme',
      priority: 'high',
      loader: async () => {
        // Preload user profile and curriculum theme data
        const userId = this.getCurrentUserId();
        if (userId) {
          await this.preloadUserProfile(userId);
          await this.preloadCurriculumTheme(userId);
        }
      },
      estimatedTime: 500
    });

    // Dashboard data preloading
    this.register({
      id: 'dashboard-data',
      name: 'Dashboard Data',
      priority: 'high',
      dependencies: ['user-profile'],
      loader: async () => {
        const userId = this.getCurrentUserId();
        if (userId) {
          await this.preloadDashboardData(userId);
        }
      },
      estimatedTime: 1000
    });

    // Progress data preloading
    this.register({
      id: 'progress-data',
      name: 'Progress Data',
      priority: 'medium',
      dependencies: ['user-profile'],
      loader: async () => {
        const userId = this.getCurrentUserId();
        if (userId) {
          await this.preloadProgressData(userId);
        }
      },
      estimatedTime: 800
    });

    // Subject data preloading
    this.register({
      id: 'subject-data',
      name: 'Subject Data',
      priority: 'medium',
      dependencies: ['user-profile'],
      loader: async () => {
        const userId = this.getCurrentUserId();
        if (userId) {
          await this.preloadSubjectData(userId);
        }
      },
      estimatedTime: 600
    });

    // Common UI components preloading
    this.register({
      id: 'ui-components',
      name: 'UI Components',
      priority: 'low',
      loader: async () => {
        await this.preloadUIComponents();
      },
      estimatedTime: 300
    });
  }

  register(strategy: PreloadStrategy) {
    this.strategies.set(strategy.id, strategy);
  }

  async preloadAll(options: {
    priority?: 'high' | 'medium' | 'low';
    maxConcurrent?: number;
    timeout?: number;
  } = {}) {
    const { priority = 'low', maxConcurrent = 3, timeout = 30000 } = options;
    
    const strategies = Array.from(this.strategies.values())
      .filter(strategy => this.getPriorityLevel(strategy.priority) >= this.getPriorityLevel(priority))
      .sort((a, b) => this.getPriorityLevel(b.priority) - this.getPriorityLevel(a.priority));

    const semaphore = new Semaphore(maxConcurrent);
    const promises = strategies.map(strategy => 
      semaphore.acquire(() => this.executeStrategy(strategy, timeout))
    );

    const results = await Promise.allSettled(promises);
    
    return {
      total: strategies.length,
      completed: this.completed.size,
      failed: this.failed.size,
      results
    };
  }

  async preloadByIds(ids: string[], options: { timeout?: number } = {}) {
    const { timeout = 30000 } = options;
    
    const promises = ids.map(id => {
      const strategy = this.strategies.get(id);
      if (!strategy) {
        throw new Error(`Strategy not found: ${id}`);
      }
      return this.executeStrategy(strategy, timeout);
    });

    return Promise.allSettled(promises);
  }

  private async executeStrategy(strategy: PreloadStrategy, timeout: number) {
    if (this.loading.has(strategy.id) || this.completed.has(strategy.id)) {
      return;
    }

    // Check dependencies
    if (strategy.dependencies) {
      const unmetDependencies = strategy.dependencies.filter(dep => !this.completed.has(dep));
      if (unmetDependencies.length > 0) {
        throw new Error(`Unmet dependencies for ${strategy.id}: ${unmetDependencies.join(', ')}`);
      }
    }

    this.loading.add(strategy.id);
    
    try {
      await Promise.race([
        strategy.loader(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout: ${strategy.id}`)), timeout)
        )
      ]);
      
      this.completed.add(strategy.id);
    } catch (error) {
      this.failed.add(strategy.id);
      console.error(`Failed to preload ${strategy.id}:`, error);
      throw error;
    } finally {
      this.loading.delete(strategy.id);
    }
  }

  private getPriorityLevel(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  // Specific preloading methods
  private async preloadUserProfile(userId: string) {
    const cacheKey = `user_profile_${userId}`;
    if (componentCache.get(cacheKey)) return;

    // Simulate API call - replace with actual implementation
    try {
      const profile = await this.fetchUserProfile(userId);
      componentCache.set(cacheKey, profile, 15 * 60 * 1000); // 15 minutes
    } catch (error) {
      console.error('Failed to preload user profile:', error);
    }
  }

  private async preloadCurriculumTheme(userId: string) {
    const cacheKey = `curriculum_theme_${userId}`;
    if (componentCache.get(cacheKey)) return;

    try {
      const theme = await this.fetchCurriculumTheme(userId);
      componentCache.set(cacheKey, theme, 10 * 60 * 1000); // 10 minutes
    } catch (error) {
      console.error('Failed to preload curriculum theme:', error);
    }
  }

  private async preloadDashboardData(userId: string) {
    const existing = await dashboardCache.getDashboardData(userId);
    if (existing) return;

    try {
      const data = await this.fetchDashboardData(userId);
      await dashboardCache.cacheDashboardData(userId, data);
    } catch (error) {
      console.error('Failed to preload dashboard data:', error);
    }
  }

  private async preloadProgressData(userId: string) {
    const existing = ProgressCache.getSubjectProgress('math'); // Check if cache has data
    if (existing) return;

    try {
      // Preload progress data for all subjects
      const subjects = ['math', 'science', 'english', 'history'];
      for (const subject of subjects) {
        ProgressCache.getSubjectProgress(subject);
        ProgressCache.getProgressStats(subject);
      }
    } catch (error) {
      console.error('Failed to preload progress data:', error);
    }
  }

  private async preloadSubjectData(userId: string) {
    const subjects = ['Mathematics', 'Science', 'English', 'History']; // Get from curriculum
    
    for (const subject of subjects) {
      const existing = await dashboardCache.getSubjectData(userId, subject);
      if (!existing) {
        try {
          const data = await this.fetchSubjectData(userId, subject);
          await dashboardCache.cacheSubjectData(userId, subject, data);
        } catch (error) {
          console.error(`Failed to preload ${subject} data:`, error);
        }
      }
    }
  }

  private async preloadUIComponents() {
    const commonComponents = [
      'theme-selector',
      'progress-charts',
      'notification-center',
      'activity-feed'
    ];

    for (const component of commonComponents) {
      const cacheKey = `ui_${component}`;
      if (!uiCache.get(cacheKey)) {
        try {
          const data = await this.fetchUIComponentData(component);
          uiCache.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
        } catch (error) {
          console.error(`Failed to preload ${component}:`, error);
        }
      }
    }
  }

  // Mock API methods - replace with actual implementations
  private async fetchUserProfile(userId: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id: userId, name: 'User', curriculum: 'CBE' };
  }

  private async fetchCurriculumTheme(userId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return { primary: 'purple', secondary: 'light-purple' };
  }

  private async fetchDashboardData(userId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      recentActivity: [],
      achievements: [],
      weeklyProgress: [],
      studyStreak: 5,
      completionRate: 0.75,
      averageScore: 0.85,
      studyTime: 120,
      currentGoals: [],
      upcomingDeadlines: [],
      subjectPerformance: []
    };
  }

  private async fetchProgressData(userId: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      overallProgress: 0.65,
      completedLessons: 45,
      totalLessons: 70,
      currentStreak: 7,
      weeklyGoal: 20,
      weeklyProgress: 15,
      monthlyProgress: 0.8,
      subjectProgress: []
    };
  }

  private async fetchSubjectData(userId: string, subject: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 80));
    return {
      name: subject,
      progress: Math.random(),
      score: Math.random(),
      completed: Math.floor(Math.random() * 20),
      total: 25
    };
  }

  private async fetchUIComponentData(component: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 30));
    return { component, data: `cached-${component}` };
  }

  private getCurrentUserId(): string | null {
    // Get current user ID from auth context or localStorage
    return localStorage.getItem('userId') || null;
  }

  // Status methods
  getStatus() {
    return {
      strategies: this.strategies.size,
      loading: this.loading.size,
      completed: this.completed.size,
      failed: this.failed.size,
      loadingStrategies: Array.from(this.loading),
      completedStrategies: Array.from(this.completed),
      failedStrategies: Array.from(this.failed)
    };
  }

  reset() {
    this.loading.clear();
    this.completed.clear();
    this.failed.clear();
  }
}

// Semaphore for controlling concurrent operations
class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const tryAcquire = () => {
        if (this.permits > 0) {
          this.permits--;
          task()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.permits++;
              const next = this.queue.shift();
              if (next) next();
            });
        } else {
          this.queue.push(tryAcquire);
        }
      };
      tryAcquire();
    });
  }
}

// Export singleton instance
export const cachePreloader = new CachePreloader();

// Auto-preload on app start
export async function initializeCache() {
  try {
    await cachePreloader.preloadAll({ priority: 'high', maxConcurrent: 2 });
  } catch (error) {
    console.error('Failed to initialize cache:', error);
  }
}
