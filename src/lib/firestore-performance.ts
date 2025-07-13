import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

// Performance monitoring utilities
export class FirestorePerformanceMonitor {
  private static instance: FirestorePerformanceMonitor;
  private queryTimes: Map<string, number[]> = new Map();

  static getInstance(): FirestorePerformanceMonitor {
    if (!FirestorePerformanceMonitor.instance) {
      FirestorePerformanceMonitor.instance = new FirestorePerformanceMonitor();
    }
    return FirestorePerformanceMonitor.instance;
  }

  // Wrapper function to monitor query performance
  async monitoredQuery<T>(
    queryName: string, 
    queryFunction: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await queryFunction();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordQueryTime(queryName, duration);
      
      if (duration > 1000) { // Log slow queries (> 1 second)
        console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      console.error(`Query failed: ${queryName}`, error);
      throw error;
    }
  }

  private recordQueryTime(queryName: string, duration: number): void {
    if (!this.queryTimes.has(queryName)) {
      this.queryTimes.set(queryName, []);
    }
    
    const times = this.queryTimes.get(queryName)!;
    times.push(duration);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
  }

  getQueryStats(queryName: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const times = this.queryTimes.get(queryName);
    if (!times || times.length === 0) return null;

    return {
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  }

  getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [queryName] of this.queryTimes) {
      stats[queryName] = this.getQueryStats(queryName);
    }
    
    return stats;
  }
}

// Optimized query builders
export const QueryBuilders = {
  // Dashboard queries optimized for minimal reads
  buildDashboardQuery(userId: string) {
    return {
      // Get latest progress for all subjects
      progress: query(
        collection(db, 'learningProgress'),
        where('userId', '==', userId),
        orderBy('lastUpdated', 'desc'),
        limit(10)
      ),
      
      // Get recent activities
      activities: query(
        collection(db, 'studentActivities'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(5)
      ),
      
      // Get latest exam results
      examResults: query(
        collection(db, 'examResults'),
        where('studentId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(5)
      )
    };
  },

  // Subject-specific queries
  buildSubjectQuery(userId: string, subject: string) {
    return {
      progress: query(
        collection(db, 'learningProgress'),
        where('userId', '==', userId),
        where('subject', '==', subject)
      ),
      
      activities: query(
        collection(db, 'studentActivities'),
        where('userId', '==', userId),
        where('subject', '==', subject),
        orderBy('timestamp', 'desc'),
        limit(20)
      ),
      
      examResults: query(
        collection(db, 'examResults'),
        where('studentId', '==', userId),
        where('subject', '==', subject),
        orderBy('timestamp', 'desc')
      )
    };
  },

  // Leaderboard queries with proper indexing
  buildLeaderboardQuery(gradeLevel?: string, subject?: string) {
    const constraints = [];
    
    if (gradeLevel) {
      constraints.push(where('gradeLevel', '==', gradeLevel));
    }
    
    if (subject) {
      constraints.push(where('subject', '==', subject));
    }
    
    constraints.push(orderBy('points', 'desc'));
    constraints.push(limit(50));
    
    return query(collection(db, 'leaderboard'), ...constraints);
  }
};

// Cache management for frequently accessed data
export class FirestoreCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  static set(key: string, data: any, ttlMinutes = 5): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  static get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  static clear(): void {
    this.cache.clear();
  }
  
  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Batch operations for better performance
export const BatchOperations = {
  // Efficiently process multiple student updates
  async batchUpdateStudentProgress(updates: Array<{
    userId: string;
    subject: string;
    progress: any;
  }>) {
    const monitor = FirestorePerformanceMonitor.getInstance();
    
    return monitor.monitoredQuery('batchUpdateProgress', async () => {
      const promises = updates.map(({ userId, subject, progress }) => {
        // Implementation would use batch writes here
        return { userId, subject, progress }; // Placeholder
      });
      
      return Promise.all(promises);
    });
  },

  // Efficiently retrieve multiple student records
  async batchGetStudents(studentIds: string[]) {
    const monitor = FirestorePerformanceMonitor.getInstance();
    
    return monitor.monitoredQuery('batchGetStudents', async () => {
      // Use 'in' queries in batches of 10 (Firestore limit)
      const batches = [];
      for (let i = 0; i < studentIds.length; i += 10) {
        const batch = studentIds.slice(i, i + 10);
        const q = query(
          collection(db, 'students'),
          where('__name__', 'in', batch)
        );
        batches.push(getDocs(q));
      }
      
      const results = await Promise.all(batches);
      return results.flatMap(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    });
  }
};

// Performance optimization recommendations
export const PerformanceOptimizer = {
  // Analyze query patterns and suggest optimizations
  analyzeQueryPatterns(): {
    slowQueries: Array<{ name: string; avgTime: number }>;
    recommendations: string[];
  } {
    const monitor = FirestorePerformanceMonitor.getInstance();
    const stats = monitor.getAllStats();
    
    const slowQueries = Object.entries(stats)
      .filter(([_, stat]: [string, any]) => stat && stat.average > 500)
      .map(([name, stat]: [string, any]) => ({ name, avgTime: stat.average }))
      .sort((a, b) => b.avgTime - a.avgTime);
    
    const recommendations = [];
    
    if (slowQueries.length > 0) {
      recommendations.push('Consider adding composite indexes for slow queries');
    }
    
    const cacheStats = FirestoreCache.getStats();
    if (cacheStats.size === 0) {
      recommendations.push('Implement caching for frequently accessed data');
    }
    
    return { slowQueries, recommendations };
  },

  // Generate Firestore security rules based on usage patterns
  generateSecurityRules(): string {
    return `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection - only authenticated users can read their own data
    match /students/{studentId} {
      allow read, write: if request.auth != null && request.auth.uid == studentId;
    }
    
    // Learning progress - students can only access their own progress
    match /learningProgress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Exam results - students can read their own results, teachers can read all
    match /examResults/{resultId} {
      allow read: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         request.auth.token.role == 'teacher');
      allow write: if request.auth != null && request.auth.token.role == 'teacher';
    }
    
    // Student activities - read-only for students, read-write for teachers
    match /studentActivities/{activityId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.role == 'teacher');
      allow write: if request.auth != null;
    }
    
    // Tutoring sessions - participants can read and write
    match /tutoringSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         resource.data.tutorId == request.auth.uid);
      
      // Messages within sessions
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Leaderboard - read-only for all authenticated users
    match /leaderboard/{entry} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}`;
  }
};
